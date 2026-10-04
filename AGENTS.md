# AGENTS — UMBRAL BOOKING OSVALDO

**Status:** ACTIVE / MANDATORY FOR MATERIAL WORK  
**Product:** `MVP-001 = BOOKING`  
**Repository:** `Osmauelias/umbral-booking-osvaldo`

## 0. Identity

This repository owns Booking for Osvaldo.

It does not own Torre de Control or Tiempos.

```text
BOOKING = MVP-001 PRODUCT
TIEMPOS = HORIZONTAL TEMPORAL ENGINE
TORRE = OSVALDO CONTROL / GOVERNANCE SURFACE
```

Hard identity rules:

`BOOKING USES TIEMPOS != BOOKING OWNS TIEMPOS`

`TORRE USES BOOKING != TORRE OWNS BOOKING`

`CONSUMER INTEGRATION != PRODUCT OWNERSHIP`

## 1. Mandatory bootstrap

Before any material implementation:

1. read `START_HERE.md`;
2. read `README.md`;
3. read `UMBRAL_RUNTIME_MANIFEST.yaml`;
4. read the relevant migration/contract docs;
5. verify current source/runtime authority;
6. inspect only the source evidence needed for the mission;
7. emit `WORKER_BOOTSTRAP_PASS`.

```text
WORKER_BOOTSTRAP_PASS
PRODUCT: MVP-001 BOOKING
MISSION:
START_HERE_READ: YES | NO
CURRENT_RUNTIME_AUTHORITY:
CURRENT_SOURCE_AUTHORITY:
TIEMPOS_CONTRACT_READ:
TORRE_INTEGRATION_SCOPE:
KNOWN_GOOD_BASELINE:
DO_NOT_REPEAT:
READ_SCOPE:
WRITE_SCOPE:
SECRET_ALIASES_REQUIRED:
UNRESOLVED_AUTHORITY_GAPS:
STATUS: PASS | BLOCKED
```

Hard gate:

`NO MATERIAL BUILD BEFORE WORKER_BOOTSTRAP_PASS = PASS`

## 2. Current migration state

The known integrated implementation still exists in legacy co-location under:

`Osmauelias/umbral-torre-control@umbral/torre-functional-circuit-1`

Bootstrap source head observed 2026-10-04:

`dd897f2f4ddc0b2d6c9cc11b1ae5f164def755ba`

Do not assume every file in that branch belongs to Booking.

Use ownership classes:

- `BOOKING_OWNED`
- `TORRE_OWNED`
- `TIEMPOS_OWNED`
- `SHARED_CONTRACT`
- `RUNTIME_INTEGRATION`
- `AMBIGUOUS_NEEDS_ADJUDICATION`

Migration sequence:

`COPY -> ADAPT CONTRACTS -> TEST -> CONTROLLED SWITCH -> HUMAN PASS -> REMOVE OLD OWNERSHIP`

Never delete first.

## 3. Scope discipline

A worker receives one job.

`RECEIVES -> OWNS -> DELIVERS -> HANDS OFF TO -> MUST NOT TOUCH`

`WIDE CONTEXT / NARROW EXECUTION`

Adjacent breakage does not authorize adjacent redesign.

`ADJACENT FAILURE != AUTHORIZATION TO FIX ADJACENT ORGAN`

If separation reveals a failure, classify it:

- `HIDDEN_COUPLING_DISCOVERED`
- `MIGRATION_MECHANICS_ERROR`
- `RUNTIME_SECRET_CONFIG_ERROR`
- `ACTUAL_CONTRACT_GAP`

Do not immediately reconnect Booking inside Torre.

## 4. Tiempos boundary

Tiempos is transversal infrastructure.

Do not:

- copy the Tiempos engine into this repo;
- create a Booking-specific fork by default;
- impose Booking-only semantics on shared temporal primitives;
- write to Tiempos without explicit mission authority.

Booking may implement its own product state around requests, review, appointments and user experience while using Tiempos for temporal truth through an explicit contract.

## 5. Torre boundary

Torre is an optional consumer/control surface.

Do not:

- require Torre navigation to make Booking exist;
- put Torre dashboard concerns into Booking core;
- treat internal Osvaldo cockpit UI as the definition of Booking;
- infer that a Torre runtime binding is automatically Booking-owned.

Integration adapters may exist, but ownership must remain explicit.

## 6. Data and secrets

Never commit:

- passwords;
- API keys;
- tokens;
- cookies;
- secret values;
- raw private operator/client dossiers;
- unnecessary PII.

Store only logical names/aliases and custody pointers.

`SECRET ALIAS != SECRET VALUE`

`PRODUCT REPO != CLIENT FILE STORE`

`PRODUCT REPO != SECRET STORE`

## 7. Validation

For active runtime work:

`TECHNICAL PASS != HUMAN PASS`

Material changes must preserve or explicitly revalidate:

- public availability;
- booking request;
- pending human review;
- accept/modify/reject/cancel;
- slot hold/release/occupation behavior;
- canonical appointment/event projection;
- timezone behavior;
- idempotency where applicable;
- official runtime path;
- rollback path.

Do not use demo/local success as proof of production behavior.

## 8. Documentation return

Every material mission closes with:

```text
DOCUMENTATION_SIGNAL = NONE | SUBMITTED
```

If `SUBMITTED`, send evidence to:

`Osmauelias/umbral-documentador/INBOX/ENTRADAS/`

using its current template.

Builders submit evidence. Documentador owns institutional documentation integration.

Local product documentation belongs here; central institutional copy/index belongs in `umbral-documentador`.

## 9. Operator rule

`OSVALDO NO ES MIDDLEWARE.`

Retrieve from repos and evidence before asking Osvaldo to restate known information.
