# ACTIVE MIGRATION — MVP-001 PHYSICAL SPLIT

**Working branch:** `migration/mvp001-physical-split`  
**Status:** `IN PROGRESS / NOT MERGE-READY / NOT RUNTIME AUTHORITY`  
**Started:** 2026-10-04

## Current branch head at initial extraction

`249e86cb86ba3e2b2e9bdd760b2dfe91483e0f8f`

## Initial source copied there

```text
booking.js
booking.css
public-booking.js
public.html
tests/booking.test.mjs
tests/booking-browser.test.mjs
```

These are source-faithful extraction candidates from the legacy integrated Torre branch.

They are intentionally **not merged to main** because imports, fixtures, runtime/API boundaries and the internal review surface are not yet separated from Torre/Tiempos integration concerns.

Branch-local status:

`MIGRATION/COPY_STATUS_V0.md`

## Next technical step

Do not copy more files by filename resemblance.

Next mission should:

1. extract/split Booking constants from legacy `contracts.js`;
2. decide notification outbox ownership;
3. replace `fixtures/torre.js` with Booking-owned fixture/state factory;
4. create a minimal Booking-owned base UI shell;
5. define Booking↔Tiempos contract tests;
6. split the combined runtime/API by ownership;
7. make focused Booking tests pass here.

## Merge gate

No merge to `main` until the extracted product has resolved imports and an executable focused test command.

`SOURCE COPIED != PRODUCT SEPARATED`
