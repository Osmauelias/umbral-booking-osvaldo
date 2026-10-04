# MVP-001 PHYSICAL SEPARATION — OWNERSHIP INVENTORY V0

**Date:** 2026-10-04  
**Target:** `Osmauelias/umbral-booking-osvaldo`  
**Source:** `Osmauelias/umbral-torre-control@umbral/torre-functional-circuit-1`  
**Observed source head:** `dd897f2f4ddc0b2d6c9cc11b1ae5f164def755ba`  
**Status:** `PROVISIONAL / SOURCE-EVIDENCE BASED / VERIFY DURING EXTRACTION`

## Ownership classes

- `BOOKING_OWNED`
- `TORRE_OWNED`
- `TIEMPOS_OWNED`
- `SHARED_CONTRACT`
- `RUNTIME_INTEGRATION`
- `AMBIGUOUS_NEEDS_ADJUDICATION`

## A. Strong Booking-owned candidates

| Legacy path | Class | Target treatment | Evidence / reason |
|---|---|---|---|
| `booking.js` | `BOOKING_OWNED` | COPY then adapt imports | Booking request/review/accept/modify/reject/cancel domain behavior |
| `booking.css` | `BOOKING_OWNED` | COPY | Booking-specific presentation |
| `public-booking.js` | `BOOKING_OWNED` | COPY then adapt API boundary | Public availability/request/email flow |
| `public.html` | `BOOKING_OWNED` | COPY then verify shell/assets | Public Booking entry surface |
| `tests/booking.test.mjs` | `BOOKING_OWNED` | COPY/adapt | Product-domain regression tests |
| `tests/booking-browser.test.mjs` | `BOOKING_OWNED` | COPY/adapt | Public/internal Booking browser regression evidence |

These may enter this repo first, but must not be declared independently runnable until imports/runtime are resolved.

## B. Mixed pieces requiring extraction, not blind copy

| Legacy path | Class | Treatment | Why |
|---|---|---|---|
| `remote-booking.js` | `RUNTIME_INTEGRATION` | EXTRACT Booking admin UI from Torre/Tiempos cockpit concerns | Contains Booking review plus generic events, Tiempos calendar and Operadores/Torre projections |
| `cloud/worker.ts` | `RUNTIME_INTEGRATION` | SPLIT routes/handlers by ownership | Legacy Worker hosts combined Torre + Booking/Tiempos circuit |
| `cloud/email.ts` | `AMBIGUOUS_NEEDS_ADJUDICATION` | Inspect templates/callers, move only Booking-owned delivery logic | Could be reusable integration rather than core Booking |
| `cloud/security.ts` | `RUNTIME_INTEGRATION` | Reclassify auth/session requirements | Legacy auth may protect Torre internal surface, not Booking product universally |
| `notification-outbox.js` | `AMBIGUOUS_NEEDS_ADJUDICATION` | Inspect and extract Booking event contract if product-owned | Could become reusable notification primitive or remain integration glue |
| `adapters.js` | `SHARED_CONTRACT` | Extract only Booking↔Tiempos adapter contract | Contains temporal projection; do not steal Tiempos ownership |
| `contracts.js` | `SHARED_CONTRACT` | Split Booking product constants/contracts from Torre-only contracts | Legacy file combines concerns |
| `tests/field-gap-api.test.mjs` | `RUNTIME_INTEGRATION` | Split by endpoint ownership | Validates integrated runtime behavior |
| `tests/field-gap-ui.test.mjs` | `RUNTIME_INTEGRATION` | Split by human surface ownership | Integrated UI assertions |
| `tests/sync-booking-events.test.mjs` | `RUNTIME_INTEGRATION` | Preserve after explicit Booking↔Tiempos contract exists | Sync semantics span product boundary |
| `tests/cloud-security.test.mjs` | `RUNTIME_INTEGRATION` | Rebuild around new auth/runtime boundary | Security tests belong to actual new runtime boundary |
| `tests/contracts.test.mjs` | `SHARED_CONTRACT` | Split Booking contracts from Torre contracts | Current legacy contract set is mixed |
| `tests/notification-outbox.test.mjs` | `AMBIGUOUS_NEEDS_ADJUDICATION` | Move only if outbox becomes Booking-owned | Ownership depends on notification architecture |

## C. Likely Torre-owned / do not move by default

| Legacy path | Class | Reason |
|---|---|---|
| `app.js` | `TORRE_OWNED` / mixed legacy shell | Main Torre cockpit application; Booking should not inherit whole dashboard |
| `index.html` | `TORRE_OWNED` / mixed legacy shell | Internal Torre shell/navigation |
| `fixtures/torre.js` | `TORRE_OWNED` | Torre demo/catalog state |
| `registry.js` | `TORRE_OWNED` unless later evidence | Capability registry for Torre command/control model |
| `core.js` | `TORRE_OWNED` unless extracted contract proven | Torre object/axis behavior |
| generic Torre visual/control assets | `TORRE_OWNED` | Control surface concerns are not Booking core |

If Booking UI currently imports a Torre-owned style/shell, create a bounded Booking equivalent rather than copying the entire cockpit.

## D. Tiempos-owned

No Tiempos engine implementation should be moved from `Osmauelias/umbral-tiempos` into this repo.

Expected relationship:

`BOOKING PRODUCT STATE -> explicit temporal commands/queries -> TIEMPOS`

Tiempos primitives remain in the shared engine.

## E. Scripts / deployment

Any legacy script containing `torre-booking` or combined service names is `RUNTIME_INTEGRATION` by default.

Examples observed historically include sync/credential/provision helpers.

Do not move them unchanged until the new runtime boundary answers:

1. who owns the service;
2. which repo deploys it;
3. which data binding belongs to whom;
4. which secret aliases Booking actually requires;
5. whether Torre consumes Booking remotely or shares a deployment intentionally.

## F. Data authority inventory — pending

Before cutover classify each store/table/binding:

```text
BOOKING_PRODUCT_STATE
TIEMPOS_TEMPORAL_TRUTH
TORRE_CONTROL_STATE
SHARED_INTEGRATION_STATE
UNKNOWN
```

Known trace identifiers from legacy evidence:

- `request_id`
- `event_id`
- `appointment_event_id`

Do not silently duplicate canonical temporal truth.

## G. Secret alias inventory — pending verification

Legacy runtime manifest lists candidate names:

- `ADMIN_PASSWORD`
- `SESSION_SECRET`

These are **not automatically Booking-owned**.

Classify each:

```text
BOOKING_OWNED
TORRE_OWNED
SHARED_INTEGRATION
NOT_REQUIRED_AFTER_SPLIT
```

Never copy values.

## H. Test ownership target

The new repo should converge on at least:

```text
tests/domain-booking.test.*
tests/public-booking.test.*
tests/internal-review.test.*
tests/tiempos-contract.test.*
tests/runtime-api.test.*
tests/human-smoke-plan.md
```

Names may differ; coverage matters more than filenames.

## I. Copy gate

A file may be copied as-is only when:

- ownership is clear;
- it does not import Torre-only modules invisibly;
- it does not clone Tiempos logic;
- it contains no secret values;
- its runtime assumptions are explicit;
- rollback/provenance remain known.

Otherwise:

`EXTRACT / ADAPT / REWRITE BOUNDARY, NOT BLIND COPY.`

## J. Current migration decision

Safe now:

- establish Birth Pack;
- preserve source pointers;
- copy clearly Booking-owned pure/product files in a controlled migration branch when ready;
- build contract tests around the new boundary.

Not safe yet:

- delete Booking files from Torre;
- claim this repo is production authority;
- move combined Worker/runtime wholesale;
- copy secret values;
- modify Tiempos to accommodate unknown migration breakage.
