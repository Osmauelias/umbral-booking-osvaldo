# START HERE — MVP-001 BOOKING

**Product:** `MVP-001 = BOOKING`  
**Repository:** `Osmauelias/umbral-booking-osvaldo`  
**State:** `NEW PHYSICAL HOME / MIGRATION NOT YET CUT OVER`  
**Authority:** Osvaldo  
**Effective:** 2026-10-04

## 1. Read this first

This repo exists to end the historical physical conflation between:

- Booking;
- Torre de Control;
- Tiempos.

The target architecture is:

```text
TORRE ---------------------> BOOKING ---------------------> TIEMPOS
control/governance          MVP-001                        horizontal engine
```

All three are separable.

## 2. What Booking is

Booking owns the product journey around requesting and managing an appointment.

Core product job:

`TURN REAL AVAILABILITY INTO A HUMAN-REVIEWED APPOINTMENT WITH TRACEABLE CONTINUITY`

Current inherited behavior includes:

1. show available slots;
2. accept a booking request;
3. hold the requested slot pending review;
4. allow operator classification/review;
5. accept, modify/reschedule or reject;
6. create/update one canonical appointment/event projection;
7. cancel and release availability;
8. retain traceability and notification state.

## 3. What Booking is not

Booking is not:

- Torre;
- Tiempos;
- a universal CRM;
- an operator dossier;
- a file store;
- a secret store;
- a generic calendar engine;
- a mandate to create vertical-specific Tiempos forks.

## 4. Current source inheritance

Latest known integrated source observed at repo birth:

`Osmauelias/umbral-torre-control@umbral/torre-functional-circuit-1`

Commit:

`dd897f2f4ddc0b2d6c9cc11b1ae5f164def755ba`

That branch is a mixed physical surface. It is evidence/source for extraction, not the target topology.

Older focused reschedule branch also exists:

`Osmauelias/umbral-torre-control@fix/mvp001-reschedule-20260929`

Observed head:

`9dcf114f6c68bb0d00a95ae3fe063330425a5a64`

Do not choose a source by filename/date alone. Reconcile current runtime/source authority before code migration.

## 5. Current runtime authority

At repo birth, the new repo is **not yet runtime authority**.

The legacy integrated runtime remains documented in the Torre runtime manifest. Its exact deployed source must be re-verified before migration/cutover.

`NEW REPO EXISTS != RUNTIME CUTOVER`

Read `UMBRAL_RUNTIME_MANIFEST.yaml` for the migration-safe statement of authority.

## 6. Migration order

```text
0. FREEZE + VERIFY SOURCE/RUNTIME
1. OWNERSHIP INVENTORY
2. COPY BOOKING-OWNED PIECES
3. EXTRACT/ADAPT SHARED CONTRACTS
4. MAKE BOOKING RUN/TEST HERE
5. CONNECT TIEMPOS THROUGH EXPLICIT BOUNDARY
6. CONNECT TORRE AS CONSUMER WHEN NEEDED
7. TECHNICAL PASS
8. HUMAN PASS
9. CONTROLLED RUNTIME SWITCH
10. RETIRE LEGACY BOOKING OWNERSHIP FROM TORRE
11. DOCUMENTADOR CLOSEOUT
```

Do not skip from repo creation to deletion in Torre.

## 7. Known candidate Booking-owned files in legacy source

Strong candidates:

- `booking.js`
- `booking.css`
- `public-booking.js`
- `public.html`
- `tests/booking.test.mjs`
- `tests/booking-browser.test.mjs`

Needs extraction/adaptation review because it currently crosses product boundaries:

- `remote-booking.js`
- `cloud/worker.ts`
- `cloud/email.ts`
- `notification-outbox.js`
- `adapters.js`
- `contracts.js`
- integration/sync scripts;
- field-gap tests;
- runtime/deploy configuration.

Likely Torre-owned or mixed unless evidence says otherwise:

- Torre navigation/dashboard shell;
- generic Torre `app.js`;
- Torre object registry/governance UI;
- Torre-only fixtures and control projections.

See `MIGRATION/OWNERSHIP_INVENTORY_V0.md`.

## 8. Tiempos inheritance

Tiempos is shared infrastructure at:

`Osmauelias/umbral-tiempos`

Its own START_HERE states:

`TIEMPOS = HORIZONTAL TEMPORAL ENGINE / INFRASTRUCTURE`

and:

`MVP-001 = BOOKING`

The current known integrated source pointer for the existing circuit is:

`Osmauelias/umbral-tiempos@umbral/torre-functional-circuit-1`

Never modify Tiempos merely because a Booking migration breaks; prove the shared primitive is defective first.

## 9. Documentation and memory

Local operational documentation lives here.

Central institutional memory/provenance lives in:

`Osmauelias/umbral-documentador`

Material signals go through its Oficialía:

`INBOX/ENTRADAS/`

`OWNER REPO + UMBRAL-DOCUMENTADOR`

## 10. Definition of done for the physical split

PASS only when:

- this repo has an executable/testable Booking product;
- Booking no longer requires Torre filesystem ownership;
- Tiempos remains one transversal engine;
- Torre can exist without Booking;
- Booking can exist without Torre;
- runtime/source authority is explicit;
- rollback is known;
- no secrets leaked;
- Human Pass confirms the actual booking journey;
- Documentador records the migration and resulting microhistory.

## 11. First worker output

Every new worker must emit the `WORKER_BOOTSTRAP_PASS` from `AGENTS.md` before touching material code.

If current source/runtime authority is unclear:

`STATUS = BLOCKED`

Do not guess.
