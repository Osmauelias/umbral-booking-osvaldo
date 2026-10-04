# INITIAL PHYSICAL EXTRACTION STATUS V0

**Branch:** `migration/mvp001-physical-split`  
**Date:** 2026-10-04  
**Status:** `COPIED SOURCE EVIDENCE / NOT RUNNABLE YET / NOT CUT OVER`

## Copied from legacy integrated source

Source:

`Osmauelias/umbral-torre-control@umbral/torre-functional-circuit-1`

Observed source head:

`dd897f2f4ddc0b2d6c9cc11b1ae5f164def755ba`

Copied:

```text
booking.js
booking.css
public-booking.js
public.html
tests/booking.test.mjs
tests/booking-browser.test.mjs
```

## Why these files

They are the strongest Booking-owned candidates in the current legacy topology.

They were copied first to preserve source fidelity and make hidden dependencies visible.

`COPY != SEPARATION COMPLETE`

## Known unresolved dependencies

### `booking.js`

Still imports:

```text
./contracts.js
./notification-outbox.js
```

Those legacy modules are mixed/shared and must be split or adjudicated before copying.

### `public-booking.js`

Still imports Booking constants from legacy `contracts.js`.

Its API routes assume a runtime that is not yet implemented in this repo.

### `public.html`

Still references `styles.css`, which belongs to/mixes with the legacy visual shell. Booking needs an explicit local base style decision rather than inheriting Torre's whole UI by accident.

### `tests/booking.test.mjs`

Still imports:

`../fixtures/torre.js`

The test must receive a Booking-owned fixture/factory instead of importing Torre state.

### `tests/booking-browser.test.mjs`

This is preserved as regression evidence but is **strongly legacy-coupled**:

- legacy local URL/route;
- legacy Torre DOM IDs/navigation;
- legacy localStorage key `torre-v01-demo-v1`;
- legacy calendar/Torre shell assumptions.

It must be rewritten as a Booking-owned Human/Browser regression test. Do not treat it as target architecture.

## Next extraction tasks

1. split Booking constants/contracts out of legacy `contracts.js`;
2. decide notification/outbox ownership and extract the Booking event contract;
3. create Booking-owned test fixture/state factory;
4. create minimal Booking base visual shell without Torre navigation;
5. define explicit Booking↔Tiempos adapter/API contract;
6. split Booking routes from legacy combined Worker;
7. establish package/build/test config;
8. make domain tests pass from this repo;
9. make public Booking test pass;
10. build internal review surface without importing Torre cockpit concerns;
11. validate runtime and Human Pass before cutover.

## Hard stop

Do not merge this migration branch to `main` as a working product until at least:

```text
IMPORTS RESOLVED
+ BOOKING-OWNED FIXTURES
+ TEST COMMAND EXISTS
+ DOMAIN TESTS PASS
+ PUBLIC FLOW PASS
+ TIEMPOS CONTRACT EXPLICIT
+ RUNTIME AUTHORITY PLAN EXPLICIT
```

Do not remove legacy source ownership from Torre before controlled cutover + Human Pass.
