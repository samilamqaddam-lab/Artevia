# Pack Prefill UX Plan

## Entry point
- Update pack CTA links to target `/[locale]/rfq?pack=<id>` so the selection survives navigation and SSR.
- Ensure IDs used in content match `src/lib/packs.ts` definitions to avoid dead links.

## Prefill logic
- In `QuoteBasketView`, parse `pack` from `useSearchParams()` (client side only).
- Look up the pack via `getPackById`. If not found, no action.
- Before inserting, remove existing quote items tagged with the same pack to keep state idempotent.
- Inject each `PackLineItem` into the store with:
  - `methodId`/`zoneId`/`leadTimeId` falling back to product defaults when omitted.
  - `colorCount` defaulting to 1 (or method max) if missing.
  - `projectId` set to the pack ID for grouping / future edits.
- Prefill the notes field with `pack.notes` only when the textarea is empty, to avoid overwriting user input.
- Surface the suggested quantities on the homepage cards by deriving a localized string from the pack configuration.

## UX feedback
- After prefill, surface a toast/alert confirming the pack load (reuse existing alert pattern for now).
- Scroll to basket summary when items were inserted to show totals update.
- Consider disabling duplicate alerts on subsequent renders (e.g., memoise on `pack` param + item count).

## Routing & persistence
- Once pack items are pushed, optionally clean the query string using `router.replace` to avoid reapplying on navigation.
- Because the quote store is persisted, ensure clearing resets `projectId` markers alongside items.

## Discounts
- Attach a discount metadata block to each pack definition (code, percentage, description).
- When a pack is fully satisfied (all lines present with required quantities), compute the discount against the pack subtotal and display it in the RFQ summary.
- Drop the discount automatically if a pack line is removed or its quantity falls below the threshold.
- Replace blocking alerts with toast notifications so the pack / checkout flow stays inline.
- Provide an inline confirmation card once the order is queued for manual review, and keep the checkout form lightweight (entreprise, contact, email, téléphone).

## Validation & tests
- Unit test `getPackById` (happy path + invalid) and a helper that transforms `PackDefinition` into store payloads.
- Component test stub (Playwright) verifying `/fr/rfq?pack=...` results in populated items and summary totals.
- Smoke test for empty store and for mixing manual items + pack items to ensure we do not wipe unrelated data.
- Capture an integration test for the toast + quote export flow once the UI is stable.
