# BOOKING PHYSICAL MIGRATION — SOURCE BASELINE V0

**Date:** 2026-10-04  
**Target repo:** `Osmauelias/umbral-booking-osvaldo`  
**Product:** `MVP-001 = BOOKING`  
**Status:** `EVIDENCE CAPTURED / CUTOVER NOT STARTED`

## 1. Why this exists

Booking was historically implemented inside the Torre repository/runtime surface even though the product identities are distinct.

The physical split must preserve a known source baseline so workers do not reconstruct from memory or grab an arbitrary branch.

`DOCUMENTED SEPARATION != PHYSICAL SEPARATION`

## 2. Current integrated migration source

Repository:

`Osmauelias/umbral-torre-control`

Most recent integrated circuit branch observed during bootstrap:

`umbral/torre-functional-circuit-1`

Observed head:

`dd897f2f4ddc0b2d6c9cc11b1ae5f164def755ba`

Observed commit date:

`2026-10-04`

This branch contains both Torre and Booking concerns. It is a **migration source**, not a target folder structure.

## 3. Focused reschedule branch

A focused Booking/reschedule branch also exists:

`fix/mvp001-reschedule-20260929`

Observed head:

`9dcf114f6c68bb0d00a95ae3fe063330425a5a64`

Observed files include Booking UI/domain/runtime/test changes.

Comparison evidence shows this branch and an earlier Cerebro branch diverged; therefore branch recency alone is not enough to declare canonical production source.

## 4. Source files observed in the integrated branch

Clearly Booking-named files:

```text
booking.js
booking.css
public-booking.js
public.html
remote-booking.js
```

Relevant runtime/integration files observed:

```text
cloud/worker.ts
cloud/email.ts
cloud/security.ts
notification-outbox.js
adapters.js
contracts.js
package.json
package-lock.json
wrangler/config when present
scripts/*booking*
```

Relevant tests observed include:

```text
tests/booking.test.mjs
tests/booking-browser.test.mjs
tests/field-gap-api.test.mjs
tests/field-gap-ui.test.mjs
tests/sync-booking-events.test.mjs
tests/cloud-security.test.mjs
tests/contracts.test.mjs
tests/notification-outbox.test.mjs
```

Not every listed file is Booking-owned. See the ownership inventory.

## 5. Known product behavior from source evidence

The legacy contract documents describe:

- public flow with date/time + contact data;
- Mexico City timezone as current Osvaldo-instance behavior;
- request creates `PENDING_REVIEW`, not an appointment;
- requested slot becomes held pending review;
- internal human classification;
- ACCEPT creates one canonical appointment/event projection;
- MODIFY moves the hold/occupation and updates the same appointment/event relationship;
- REJECT releases the slot;
- CANCEL releases slot and cancels appointment/event;
- notification/email handling is explicit and traceable;
- Tiempos primitives remain a separate boundary.

These behaviors are preservation targets during extraction, not permission to freeze all future product design forever.

## 6. Runtime authority warning

The legacy Torre runtime manifest states that the official observed runtime was a Cloudflare Worker and explicitly warns that exact deployed source must be re-verified after deploy/rollback.

Therefore:

`LEGACY BRANCH FOUND != EXACT DEPLOYED SOURCE PROVEN`

Before production cutover:

1. verify current official URL/service;
2. verify current Worker/runtime version;
3. verify current exact deployed commit if possible;
4. verify current data bindings;
5. verify secret logical names/custody;
6. preserve rollback.

## 7. Tiempos source relationship

`Osmauelias/umbral-tiempos` declares itself:

`TIEMPOS = HORIZONTAL TEMPORAL ENGINE / INFRASTRUCTURE`

and identifies:

`MVP-001 = BOOKING`

Its current integrated source pointer for the existing circuit is:

`Osmauelias/umbral-tiempos@umbral/torre-functional-circuit-1`

Do not clone that engine into Booking.

## 8. Historical naming contamination

Older artifacts may say:

- Torre/Tiempos/Booking;
- Torre/Booking;
- MVP-001 Torre + Tiempos + Booking.

Those names are provenance of an earlier architecture, not current identity.

Current identity:

```text
MVP-001 = BOOKING
TORRE = SEPARATE OSVALDO CONTROL SURFACE
TIEMPOS = SEPARATE HORIZONTAL ENGINE
```

## 9. Next evidence gate

Before copying mixed/runtime files, complete or update:

`MIGRATION/OWNERSHIP_INVENTORY_V0.md`

Any `AMBIGUOUS_NEEDS_ADJUDICATION` item stays in the legacy source until evidence resolves it.

`COPY KNOWN OWNERSHIP; DO NOT MOVE AMBIGUITY BY GUESS.`
