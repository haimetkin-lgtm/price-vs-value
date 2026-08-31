# Payment security rollout (review only)

Nothing in this change is active until the migration and Edge Functions are reviewed and deployed.

## Server secrets/configuration

- `CARDCOM_TERMINAL_NUMBER`
- `CARDCOM_API_USERNAME`
- `CARDCOM_LINK_STANDARD`
- `CARDCOM_LINK_APPRAISER`
- `PUBLIC_SITE_URL`
- `REPORT_TOKEN_SECRET` (at least 32 random bytes; rotation invalidates existing links)
- `INTERNAL_FUNCTION_SECRET` (independent random value)
- existing Supabase and Resend secrets

Never expose these as `NEXT_PUBLIC_*` variables.

## Required Cardcom configuration

Confirm with Cardcom that the two hosted EA/EA5 links accept `ReturnValue`,
`IndicatorUrl`, `SuccessRedirectUrl`, and `ErrorRedirectUrl` overrides. If they do
not, replace them with API 10/11 server-created low-profile checkout sessions.
The indicator must pull transaction details from Cardcom and verify response,
order, ILS currency, exact persisted amount, and unique provider transaction.

## Rollout order

1. Compare the migration with the live schema, policies, grants and legacy rows.
2. Back up policies/schema and decide how existing paid reports receive access tokens.
3. Configure secrets and Cardcom indicator URL.
4. Deploy `create-checkout`, `cardcom-indicator`, and hardened `send-report-email`.
5. Apply the migration in a controlled maintenance window.
6. Deploy the static frontend immediately after the migration.
7. Test only with an explicitly approved provider test plan; do not create a
   real or sandbox order under the current audit authorization.
8. Add rate limiting/abuse protection before public rollout.

## Expected invariants

- The browser never writes `paid`, provider references, amounts, or entitlements.
- The amount and product are selected by the server and frozen on the order.
- A repeated idempotency key returns the same order and access capability.
- Indicator retries are safe and a provider transaction is globally unique.
- Only a Cardcom transaction verified server-to-server can atomically mark the
  matching order and report paid.
- Raw report access tokens are never stored; only SHA-256 hashes are stored.
- Direct table access cannot enumerate paid reports.

## Known rollout blockers

- Live schema and `insure-vda` admin compatibility have not yet been inspected.
- Cardcom hosted-link override behavior has not been confirmed for this merchant.
- Legacy `/share` and history links need a migration/compatibility decision.
- Rate limiting is not implemented in this repository.
