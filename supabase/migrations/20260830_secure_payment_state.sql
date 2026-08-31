-- REVIEW ONLY. Apply only after comparing with the live schema and backing it up.
create extension if not exists pgcrypto;
alter table public.reports add column if not exists access_token_hash text,
  add column if not exists payment_verified_at timestamptz,
  add column if not exists cardcom_internal_deal_number text;

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete restrict,
  idempotency_key uuid not null unique,
  product_type text not null check (product_type in ('standard','appraiser')),
  amount_agorot integer not null check (amount_agorot > 0),
  currency text not null check (currency = 'ILS'),
  status text not null default 'created'
    check (status in ('created','pending','paid','failed','refunded','revoked')),
  checkout_url text, low_profile_code text unique, checkout_claimed_at timestamptz,
  provider_reference text unique,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  paid_at timestamptz, email_sent_at timestamptz
);
alter table public.payment_orders enable row level security;

drop policy if exists "users_own_reports" on public.reports;
drop policy if exists "insert_report" on public.reports;
drop policy if exists "public_paid_reports" on public.reports;
-- No direct client policies: reports and orders are accessed through functions.
create policy "users_read_own_reports" on public.reports
  for select to authenticated using (auth.uid() = user_id);

create or replace function public.get_paid_report_by_token(p_token text)
returns setof public.reports language sql security definer
set search_path = public, extensions stable as $$
  select r.* from public.reports r
  where r.paid and r.payment_verified_at is not null
    and r.access_token_hash = encode(digest(p_token, 'sha256'), 'hex') limit 1;
$$;
revoke all on function public.get_paid_report_by_token(text) from public;
grant execute on function public.get_paid_report_by_token(text) to anon, authenticated;

create or replace function public.confirm_cardcom_payment(
  p_order_id uuid, p_provider_reference text, p_amount_agorot integer
) returns boolean language plpgsql security definer set search_path = public as $$
declare v_order public.payment_orders%rowtype;
begin
  select * into v_order from public.payment_orders where id=p_order_id for update;
  if not found or v_order.amount_agorot<>p_amount_agorot then return false; end if;
  if v_order.status='paid' then return v_order.provider_reference=p_provider_reference; end if;
  if v_order.status not in ('created','pending') then return false; end if;
  update public.payment_orders set status='paid', provider_reference=p_provider_reference,
    paid_at=now(), updated_at=now() where id=p_order_id;
  update public.reports set paid=true, payment_verified_at=now(),
    cardcom_internal_deal_number=p_provider_reference where id=v_order.report_id;
  return true;
end; $$;
revoke all on function public.confirm_cardcom_payment(uuid,text,integer) from public;
grant execute on function public.confirm_cardcom_payment(uuid,text,integer) to service_role;

create or replace function public.create_payment_order(
  p_order_id uuid, p_idempotency_key uuid, p_product_type text,
  p_amount_agorot integer, p_user_id uuid, p_report jsonb, p_access_token_hash text
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_existing public.payment_orders%rowtype; v_report_id uuid;
begin
  select * into v_existing from public.payment_orders where idempotency_key=p_idempotency_key;
  if found then
    if v_existing.product_type<>p_product_type then raise exception 'idempotency conflict'; end if;
    return v_existing.id;
  end if;
  insert into public.reports(user_id,tier,city,rooms,market_price,paff,v_rent,v_cost,v_econ,
    price_premium_pct,pir,hai,dsti,uch_annual,rent_annual,inputs_json,paid,
    customer_name,customer_email,customer_phone,access_token_hash)
  values (p_user_id,p_product_type,p_report->>'city',(p_report->>'rooms')::numeric,
    (p_report->>'marketPrice')::numeric,(p_report->>'paff')::numeric,(p_report->>'vRent')::numeric,
    (p_report->>'vcost')::numeric,nullif(p_report->>'vEcon','')::numeric,
    (p_report->>'pricePremiumPct')::numeric,(p_report->>'pir')::numeric,(p_report->>'hai')::numeric,
    (p_report->>'dsti')::numeric,(p_report->>'uchAnnual')::numeric,(p_report->>'rentAnnual')::numeric,
    coalesce(p_report->'inputsJson','{}'::jsonb),false,p_report->>'name',p_report->>'email',
    p_report->>'phone',p_access_token_hash) returning id into v_report_id;
  insert into public.payment_orders(id,report_id,idempotency_key,product_type,amount_agorot,currency,status)
  values(p_order_id,v_report_id,p_idempotency_key,p_product_type,p_amount_agorot,'ILS','pending');
  return p_order_id;
exception when unique_violation then
  select * into v_existing from public.payment_orders where idempotency_key=p_idempotency_key;
  if not found or v_existing.product_type<>p_product_type then raise; end if;
  return v_existing.id;
end; $$;
revoke all on function public.create_payment_order(uuid,uuid,text,integer,uuid,jsonb,text) from public;
grant execute on function public.create_payment_order(uuid,uuid,text,integer,uuid,jsonb,text) to service_role;

create or replace function public.claim_payment_checkout(p_order_id uuid)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_claimed boolean;
begin
  update public.payment_orders
  set checkout_claimed_at=now(), updated_at=now()
  where id=p_order_id and checkout_url is null
    and (checkout_claimed_at is null or checkout_claimed_at < now() - interval '2 minutes')
  returning true into v_claimed;
  return coalesce(v_claimed, false);
end; $$;
revoke all on function public.claim_payment_checkout(uuid) from public;
grant execute on function public.claim_payment_checkout(uuid) to service_role;
