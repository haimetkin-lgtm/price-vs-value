-- מחיר מול שווי — Supabase schema
-- הרץ ב: Supabase Dashboard → SQL Editor → New query

create extension if not exists "pgcrypto";

-- טבלת דוחות
create table if not exists reports (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  user_id       uuid references auth.users(id) on delete set null,

  -- פרטי הדוח
  tier          text not null check (tier in ('standard', 'appraiser')),
  city          text not null default '',
  rooms         numeric not null default 0,
  market_price  numeric not null,

  -- תוצאות מודלים
  paff          numeric not null default 0,
  v_rent        numeric not null default 0,
  v_cost        numeric not null default 0,

  -- מדדים
  price_premium_pct numeric not null default 0,
  pir           numeric not null default 0,
  hai           numeric not null default 0,
  dsti          numeric not null default 0,
  uch_annual    numeric not null default 0,
  rent_annual   numeric not null default 0,

  -- קלטים מלאים (JSON)
  inputs_json   jsonb not null default '{}',

  -- שיתוף ותשלום
  share_token   text unique not null default encode(gen_random_bytes(12), 'hex'),
  paid          boolean not null default false,
  stripe_session_id text
);

-- אינדקסים
create index if not exists reports_user_id_idx   on reports(user_id);
create index if not exists reports_share_token_idx on reports(share_token);
create index if not exists reports_created_at_idx on reports(created_at desc);

-- RLS
alter table reports enable row level security;

-- משתמש מחובר — רואה רק את הדוחות שלו
create policy "users_own_reports" on reports
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- כל אחד יכול להכניס דוח (גם לא מחובר — יישמר עם user_id=null)
create policy "insert_report" on reports
  for insert
  with check (true);

-- דוח ששולם נגיש לכולם דרך share_token (בדיקה ב-client)
-- (אין צורך ב-policy נפרדת כי ה-client מבצע fetch לפי share_token + paid=true)
-- אם רוצים לאפשר SELECT ציבורי לדוחות ששולמו:
create policy "public_paid_reports" on reports
  for select
  using (paid = true);
