# BOOKING — INTEGRATION BOUNDARIES V0

**Product:** `MVP-001 = BOOKING`  
**Date:** 2026-10-04

## 1. Booking ↔ Tiempos

Tiempos is the horizontal temporal engine.

Booking may ask Tiempos for or send Tiempos authorized temporal operations such as:

- availability windows;
- event/appointment creation;
- reschedule/move;
- cancellation;
- conflict detection;
- free-slot calculation;
- duration/temporal rules.

Booking owns product semantics around:

- booking request;
- requester/contact context needed for the appointment flow;
- human review state;
- classification needed by Booking;
- accept/modify/reject/cancel product decisions;
- public/internal Booking UX;
- appointment continuity and traceability around the request.

Tiempos owns shared temporal primitives and temporal truth according to its own contracts.

Rules:

`BOOKING REQUEST != TEMPORAL ENGINE EVENT`

`BOOKING ACCEPT MAY CREATE/UPDATE TEMPORAL TRUTH THROUGH CONTRACT`

`BOOKING USES TIEMPOS != BOOKING OWNS TIEMPOS`

`CONSUMER INCIDENT != SHARED ENGINE DEFECT`

## 2. Torre ↔ Booking

Torre is Osvaldo's control/governance cockpit.

Torre may:

- surface Booking status;
- link/open Booking;
- show summarized appointment/request state when authorized;
- invoke Booking through an explicit integration boundary;
- include Booking in Osvaldo's global operational view.

Torre must not:

- own Booking implementation by default;
- redefine Booking identity;
- require Booking source files to live inside Torre;
- turn every Booking concern into a Torre concern.

Rules:

`TORRE CONSUMES BOOKING != TORRE OWNS BOOKING`

`TORRE CAN EXIST WITHOUT BOOKING`

`BOOKING CAN EXIST WITHOUT TORRE`

## 3. Booking ↔ Documentador / Oficialía

Material product/development signals go to:

`Osmauelias/umbral-documentador/INBOX/ENTRADAS/`

Documentator owns institutional integration of documentation.

Booking repo owns local operational/technical docs.

`OWNER REPO + UMBRAL-DOCUMENTADOR`

## 4. Booking ↔ data/file storage

This repo is not the store for raw personal/client/operator files.

If Booking needs attachments or durable files, use an authorized external file/data store and retain only bounded pointers/IDs/contracts here.

`PRODUCT REPO != CLIENT FILE STORE`

## 5. Booking ↔ secret store

This repo may document logical secret names and custody pointers only.

Never commit values.

`SECRET STORE != PRODUCT REPO`

`SECRET ALIAS != SECRET VALUE`

## 6. Current Osvaldo-instance timezone

The current inherited Osvaldo flow explicitly presents booking availability in:

`America/Mexico_City`

with human wording equivalent to "hora de Ciudad de México".

Country/prefix selection does not alter displayed scheduling timezone in the inherited product behavior.

This is a current instance/product rule, not evidence that all future Booking deployments must be single-timezone forever.

## 7. State ownership rule

Before cutover, every state field/table/object must be classified as one of:

```text
BOOKING PRODUCT STATE
TIEMPOS TEMPORAL TRUTH
TORRE CONTROL STATE
SHARED INTEGRATION STATE
EXTERNAL FILE/DATA POINTER
UNKNOWN
```

`UNKNOWN -> DO NOT MOVE BY GUESS`

## 8. Failure attribution

After separation, a failure should be attributable to:

- Booking;
- Booking↔Tiempos contract/integration;
- Tiempos shared engine;
- Torre↔Booking integration;
- runtime/config/secrets;
- data authority.

Do not collapse all failures into "Torre broke" or "Tiempos broke".
