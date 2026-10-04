import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from '../fixtures/torre.js';
import * as booking from '../booking.js';

const fresh=()=>structuredClone(fixture);

test('normaliza WhatsApp internacional sin usar país como timezone',()=>{
 assert.equal(booking.normalizeWhatsapp('MX','+52','771 123 4567').whatsapp_e164,'+527711234567');
 assert.equal(booking.normalizeWhatsapp('US','+1','1 (415) 555-0101').whatsapp_e164,'+14155550101');
 assert.equal(booking.normalizeWhatsapp('ES','+34','612345678').whatsapp_e164,'+34612345678');
 assert.throws(()=>booking.normalizeWhatsapp('XX','+1','4155550101'),/país válido/);
});

test('solicitud pública queda pendiente, retiene slot y resuelve match sólo por WhatsApp',()=>{
 const state=fresh(),slotBefore=state.booking_slots[0].start_at;
 const unmatched=booking.requestBooking(state,{slot_id:state.booking_slots[0].slot_id,country_code:'US',calling_code:'+1',whatsapp_number:'4155550101'});
 assert.equal(unmatched.status,'PENDING_REVIEW');assert.equal(unmatched.person_status,'UNRESOLVED / NEW');assert.equal(unmatched.timezone,'America/Mexico_City');assert.equal(state.booking_slots[0].status,'HELD_PENDING_REVIEW');assert.equal(state.booking_slots[0].start_at,slotBefore);
 const matched=booking.requestBooking(state,{slot_id:state.booking_slots[1].slot_id,country_code:'MX',calling_code:'+52',whatsapp_number:'5555555555'});
 assert.equal(matched.person_status,'MATCHED');assert.equal(matched.person_ref,'PERSON-DEMO-01');assert.equal(matched.email,'persona.demo@example.invalid');assert.equal(matched.classification.relationship_type,'Operador demo');
});

test('email posterior, clasificación interna, aceptar, modificar y cancelar conservan contratos',()=>{
 const state=fresh(),request=booking.requestBooking(state,{slot_id:state.booking_slots[0].slot_id,country_code:'US',calling_code:'+1',whatsapp_number:'4155550101'}),oldId=request.slot_id,newId=state.booking_slots[1].slot_id;
 booking.addConfirmationEmail(state,request.request_id,'Visitante@Example.com');
 booking.classify(state,request.request_id,{relationship_type:'Prospecto',appointment_category:'Exploración',economic_model:'DONATION_SUGGESTED',related_axis:'negocios'});
 booking.modifyBooking(state,request.request_id,newId);assert.equal(state.booking_slots.find(s=>s.slot_id===oldId).status,'AVAILABLE');assert.equal(state.booking_slots.find(s=>s.slot_id===newId).status,'HELD_PENDING_REVIEW');
 booking.acceptBooking(state,request.request_id);assert.equal(request.status,'CONFIRMED');assert.equal(state.appointments.length,1);assert.equal(state.events.filter(e=>e.metadata?.booking_request_id===request.request_id).length,1);assert.equal(state.booking_slots.find(s=>s.slot_id===newId).status,'OCCUPIED');assert.equal(state.email_demos.at(-1).type,'BOOKING_CONFIRMED');assert.match(state.email_demos.at(-1).date_time_label,/hora de Ciudad de México/);
 const third=state.booking_slots[2].slot_id;booking.modifyBooking(state,request.request_id,third);assert.equal(state.booking_slots.find(s=>s.slot_id===newId).status,'AVAILABLE');assert.equal(state.booking_slots.find(s=>s.slot_id===third).status,'OCCUPIED');assert.equal(state.email_demos.at(-1).type,'BOOKING_UPDATED');
 booking.cancelBooking(state,request.request_id);assert.equal(request.status,'CANCELLED');assert.equal(state.booking_slots.find(s=>s.slot_id===third).status,'AVAILABLE');assert.equal(state.appointments[0].status,'CANCELLED');assert.equal(state.email_demos.at(-1).type,'BOOKING_CANCELLED');assert.equal(booking.assertBookingState(state),true);
});

test('rechazo libera slot y no crea cita',()=>{const state=fresh(),request=booking.requestBooking(state,{slot_id:state.booking_slots[0].slot_id,country_code:'ES',calling_code:'+34',whatsapp_number:'612345678'});booking.rejectBooking(state,request.request_id,'No disponible');assert.equal(request.status,'REJECTED');assert.equal(state.booking_slots[0].status,'AVAILABLE');assert.equal(state.appointments.length,0);assert.equal(state.events.some(e=>e.metadata?.booking_request_id),false);});
