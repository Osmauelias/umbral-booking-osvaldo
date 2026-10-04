# UMBRAL BOOKING — OSVALDO

**Canonical identity:** `MVP-001 = BOOKING`  
**Repository:** `Osmauelias/umbral-booking-osvaldo`  
**Status:** `BOOTSTRAP READY / PHYSICAL MIGRATION NOT YET CUT OVER`  
**Authority:** Osvaldo  
**Created:** 2026-10-04

## What this repo is

This repository is the physical home of **MVP-001 — Booking** for Osvaldo.

Booking is the product that turns availability into a human-reviewed appointment flow:

`AVAILABILITY -> REQUEST -> HUMAN REVIEW -> ACCEPT / MODIFY / REJECT -> APPOINTMENT -> FOLLOW-UP / CONTINUITY`

Booking is **not** Torre de Control and is **not** Tiempos.

## Architecture

```text
TORRE DE CONTROL -----> BOOKING -----> TIEMPOS
(optional consumer)      MVP-001       horizontal temporal engine

OTHER SURFACES -------> BOOKING
OTHER PRODUCTS ----------------------> TIEMPOS
```

Rules:

`BOOKING USES TIEMPOS != BOOKING OWNS TIEMPOS`

`TORRE USES BOOKING != TORRE OWNS BOOKING`

`BOOKING != TORRE`

`BOOKING != TIEMPOS`

`MVP-001 = BOOKING`

## Current physical reality

The currently known integrated Booking implementation still materially lives inside:

`Osmauelias/umbral-torre-control@umbral/torre-functional-circuit-1`

Current observed source head at bootstrap:

`dd897f2f4ddc0b2d6c9cc11b1ae5f164def755ba`

That legacy co-location is a migration source, not the target architecture.

This repository is **not yet the official live runtime authority** merely because it exists.

Migration rule:

`COPY -> EXTRACT CONTRACTS -> TEST -> CONTROLLED SWITCH -> HUMAN PASS -> RETIRE OLD OWNERSHIP`

Never start with destructive deletion from Torre.

## Product behavior inherited from MVP-001

The current verified lineage includes:

- public availability;
- public booking request;
- WhatsApp normalization / request identity handling;
- request pending human review;
- internal classification;
- accept;
- modify / reschedule;
- reject;
- cancel;
- appointment/event projection;
- availability release/occupation;
- notification/email delivery handling where implemented;
- explicit Mexico City timezone handling in the current Osvaldo instance.

The migration must preserve behavior before expanding scope.

## Dependencies

### Tiempos

`Osmauelias/umbral-tiempos`

Role: transversal temporal engine / infrastructure.

Booking may consume availability, scheduling, event and temporal primitives through explicit contracts. Booking must not clone or fork Tiempos per vertical.

### Torre de Control

`Osmauelias/umbral-torre-control`

Role: Osvaldo control/governance cockpit.

Torre may surface or consume Booking, but Booking implementation must not require Torre filesystem ownership after separation.

### Documentador / Oficialía

`Osmauelias/umbral-documentador`

Material documentation signals go to:

`Osmauelias/umbral-documentador/INBOX/ENTRADAS/`

Documentation follows dual residence:

`OWNER REPO + UMBRAL-DOCUMENTADOR`

## Start here

Before material work read:

1. `AGENTS.md`
2. `START_HERE.md`
3. `UMBRAL_RUNTIME_MANIFEST.yaml`
4. `MIGRATION/SOURCE_BASELINE_V0.md`
5. `MIGRATION/OWNERSHIP_INVENTORY_V0.md`
6. `docs/INTEGRATION_BOUNDARIES_V0.md`
7. `docs/BOOKING_BEHAVIOR_CONTRACT_V0.md`
8. `docs/HUMAN_PASS_V0.md`

## Hard rules

- no secret values in Git;
- no raw operator/client dossiers in this repo;
- no silent overwrite of temporal truth;
- no Booking-specific clone of Tiempos;
- no reabsorbing Booking into Torre to solve migration friction;
- technical PASS is not Human Pass;
- source artifacts first, narrative second;
- Osvaldo is not middleware.

## Definition of separated

Physical separation is complete only when:

1. Booking runs/tests from this repository;
2. Booking consumes Tiempos through an explicit bounded contract;
3. Torre can consume Booking without owning its implementation;
4. the official runtime/source authority points here after controlled cutover;
5. Human Pass confirms the current Booking journey still works;
6. legacy Booking ownership inside Torre can be retired without losing rollback or provenance.
