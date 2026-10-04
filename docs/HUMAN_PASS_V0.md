# MVP-001 BOOKING — HUMAN PASS V0

**Purpose:** verify that physical separation preserves the real Booking journey.  
**Applies to:** migration/cutover from legacy Torre co-location into `umbral-booking-osvaldo`.

## Gate rule

`TECHNICAL PASS != HUMAN PASS`

Migration is not closed because tests are green or files moved.

Osvaldo (or an explicitly authorized human reviewer) must be able to use the product through the official target runtime.

## A. Public request

PASS when a visitor can:

1. open the official public Booking surface;
2. see real available slots only;
3. understand that times are shown in the configured Booking timezone;
4. choose a slot;
5. provide required contact/request data;
6. submit exactly one request;
7. receive a clear `PENDING REVIEW`-type result, not a false confirmed appointment.

Verify:

`REQUEST CREATED != APPOINTMENT CONFIRMED`

## B. Availability hold

After the request:

- the selected slot is no longer offered as freely available to another request according to the authorized hold contract;
- no duplicate active request/appointment is created by refresh/retry.

## C. Internal human review

PASS when Osvaldo can open the authorized internal Booking review surface and:

- see the request;
- see source/provenance needed to act safely;
- classify/edit permitted review fields;
- choose ACCEPT / MODIFY / REJECT as applicable;
- understand which action will create/change an appointment.

## D. Accept

PASS when ACCEPT:

- confirms the request;
- occupies the correct slot;
- creates/binds one canonical appointment/event relationship;
- does not create duplicate active temporal truth;
- remains visible after reload through the real persistence path.

## E. Modify / reschedule

PASS when an existing request/appointment can be moved to another valid slot and:

- the previous slot is released/updated correctly;
- the new slot is occupied/held correctly;
- the same request identity remains traceable;
- the canonical appointment/event relationship is updated rather than duplicated;
- the official internal UI shows the new date/time clearly.

This gate is especially important because prior lineage contained a reprogram/reschedule blocker. Do not confuse a known pre-migration defect with a migration regression; attribute with evidence.

## F. Reject

PASS when REJECT:

- records rejection;
- releases the pending slot;
- does not create an appointment.

## G. Cancel

PASS when CANCEL:

- cancels the confirmed appointment/request relationship;
- releases availability;
- cancels/updates the temporal event according to contract;
- leaves history/provenance without leaving a second active truth.

## H. Timezone

For the current Osvaldo instance:

- public and internal appointment times remain consistent with `America/Mexico_City`;
- the phone country/prefix selector does not silently alter scheduling timezone;
- human wording is explicit enough to prevent visitor confusion.

## I. Notifications / email

If the migrated runtime claims actual delivery:

- verify delivery status from the real subsystem;
- verify request/appointment correlation;
- verify modification/cancellation messaging where in scope.

If delivery remains preview/demo/not active, the UI must say so explicitly.

`PREVIEW != DELIVERED`

## J. Torre independence

PASS when:

- Booking can be opened/used without requiring Torre's source files to live in the same repo;
- Torre can be unavailable without changing Booking product ownership;
- any Torre integration is clearly a consumer/integration path.

## K. Tiempos independence

PASS when:

- Booking reaches temporal capabilities through the authorized Tiempos boundary;
- no Booking-specific Tiempos fork was introduced;
- a Booking defect can be distinguished from a Tiempos engine defect.

## L. Runtime authority

Before final PASS record:

```text
SOURCE_REPO:
SOURCE_COMMIT:
RUNTIME_PROVIDER:
SERVICE / DEPLOYMENT:
OFFICIAL_PUBLIC_URL:
OFFICIAL_INTERNAL_URL:
DATA_BINDINGS_VERIFIED:
SECRET_ALIASES_VERIFIED:
ROLLBACK_POINT:
TECHNICAL_PASS:
HUMAN_PASS:
REVIEWED_BY:
DATE:
```

No final migration PASS with `SOURCE_COMMIT = UNKNOWN` unless Osvaldo explicitly accepts that risk and it is documented.

## Final verdict

Migration PASS requires:

`BOOKING WORKS FROM ITS OWN HOUSE + TIEMPOS REMAINS TRANSVERSAL + TORRE REMAINS SEPARATE + HUMAN JOURNEY PASSES`
