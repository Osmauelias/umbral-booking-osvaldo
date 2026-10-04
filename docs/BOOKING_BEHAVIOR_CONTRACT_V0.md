# BOOKING BEHAVIOR CONTRACT V0

**Product:** `MVP-001 = BOOKING`  
**Purpose:** preserve the current human/product behavior during physical separation.  
**Source lineage:** legacy integrated Booking/Torre implementation and contracts.

## 1. Public availability

The public surface shows only currently available/published booking slots from the authorized source.

If the authoritative remote source is unavailable, do not silently substitute demo availability and present it as real.

## 2. Request creation

A public request must not equal a confirmed appointment.

Expected transition:

```text
AVAILABLE
-> BOOKING REQUEST
-> HELD_PENDING_REVIEW
```

The request starts in a review state equivalent to:

`PENDING_REVIEW`

and does not create the final appointment/event merely because the visitor submitted the form.

Invariant:

`BOOKING REQUEST != CONFIRMED APPOINTMENT`

## 3. Human review

The internal operator flow may classify the request before final decision.

Inherited classification fields include concepts such as:

- relationship type;
- appointment category;
- related axis/object;
- notes;
- economic model;
- modality;
- priority;
- owner.

Exact schema may evolve, but human review remains a real gate unless Osvaldo explicitly changes the product model.

## 4. Accept

Accepting a valid pending request:

- occupies the selected slot;
- creates or binds one canonical appointment/event relationship;
- preserves request identity/provenance;
- changes the product state to confirmed;
- emits the relevant notification/delivery event when that subsystem is active.

Invariant:

`ONE ACCEPTED REQUEST -> ONE CANONICAL ACTIVE APPOINTMENT RELATIONSHIP`

No duplicate active truth.

## 5. Modify / reschedule

A valid modification:

- releases or updates the old slot correctly;
- claims the new slot correctly;
- preserves request identity;
- updates the same canonical appointment/event relationship when one already exists;
- does not silently create a second active appointment.

Invariant:

`RESCHEDULE != DUPLICATE APPOINTMENT`

History may be preserved, but active truth must remain singular.

## 6. Reject

Rejecting a pending/modifiable request:

- records rejection state;
- releases the held slot;
- does not create a confirmed appointment.

## 7. Cancel

Cancelling a confirmed appointment:

- releases the occupied slot;
- marks the request/appointment/event relationship cancelled according to its contracts;
- preserves historical traceability;
- must not leave a duplicate active event.

## 8. Timezone — current Osvaldo instance

Current inherited public behavior uses:

`America/Mexico_City`

The human-facing label is equivalent to:

`hora de Ciudad de México`

Selecting a phone country/prefix does not change the appointment timezone.

Invariant for current instance:

`PHONE COUNTRY != SCHEDULING TIMEZONE`

## 9. Contact / WhatsApp

The inherited flow normalizes a usable WhatsApp number to an international/E.164-like canonical value and may use it as a bounded lookup key.

A person match may prefill known relationship/contact data but must not silently perform an unrelated human classification decision.

`IDENTITY MATCH != HUMAN CLASSIFICATION`

## 10. Email / notifications

Notification or email handling must distinguish:

- requested;
- accepted/confirmed;
- modified;
- cancelled;
- delivery state.

Do not claim an email was sent unless the actual delivery subsystem proves it.

`EMAIL PREVIEW != EMAIL DELIVERED`

## 11. Idempotency

Where public/internal API actions use idempotency keys, preserve the protection during migration.

Repeated transport/retry must not create duplicate booking requests, appointments or destructive repeated decisions.

## 12. Temporal projection

Booking product state and temporal truth are related but not identical.

The boundary with Tiempos must preserve at least:

- stable event identity;
- start/end;
- timezone;
- status;
- origin/provenance;
- request/appointment correlation.

Do not copy the shared temporal engine into Booking to achieve this.

## 13. Migration freeze rule

During physical separation, preserve behavior first.

Do not mix product expansion with migration unless separately authorized.

`MIGRATION != FEATURE EXPANSION`

If current behavior is intentionally changed, record the decision explicitly rather than letting it drift as a side effect of file movement.
