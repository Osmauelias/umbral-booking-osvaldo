import {BOOKING_STATUSES,COUNTRY_PREFIXES,ECONOMIC_MODELS,PUBLIC_TIMEZONE,PUBLIC_TIMEZONE_LABEL} from './contracts.js';
import {appendBookingNotification} from './notification-outbox.js';
const uid=prefix=>prefix+'-'+crypto.randomUUID();
const now=()=>new Date().toISOString();
const bySlot=(state,id)=>state.booking_slots.find(slot=>slot.slot_id===id);
const byRequest=(state,id)=>state.booking_requests.find(request=>request.request_id===id);
const digits=value=>String(value||'').replace(/\D/g,'');
export function normalizeWhatsapp(countryCode,prefix,number){
 const country=COUNTRY_PREFIXES.find(([code])=>code===countryCode);if(!country)throw Error('Selecciona un país válido');
 const canonicalPrefix=country[2]||String(prefix||'').trim();
 if(!/^\+\d{1,4}$/.test(canonicalPrefix))throw Error('Escribe un prefijo internacional válido');
 let local=digits(number),dial=digits(canonicalPrefix);
 if(local.startsWith(dial)&&local.length>10)local=local.slice(dial.length);
 const normalized='+'+dial+local;
 if(local.length<6||normalized.length<8||normalized.length>16)throw Error('Escribe un número de WhatsApp internacional utilizable');
 return {country_code:countryCode,country_name:country[1],calling_code:'+'+dial,whatsapp_national:local,whatsapp_e164:normalized};
}
export function resolvePerson(state,e164){
 const person=state.people.find(item=>item.whatsapp_e164===e164);
 return person?{person_status:'MATCHED',person_ref:person.person_ref,relationship_type:person.relationship_type,email:person.confirmation_email||null,source:person.source}:{person_status:'UNRESOLVED / NEW',person_ref:null,relationship_type:null,email:null,source:'local-demo/identity-resolution'};
}
export function publicSlots(state){return state.booking_slots.filter(slot=>slot.status==='AVAILABLE');}
export function requestBooking(state,input){
 const slot=bySlot(state,input.slot_id);if(!slot||slot.status!=='AVAILABLE')throw Error('Ese horario ya no está disponible');
 if(slot.timezone!==PUBLIC_TIMEZONE)throw Error('Timezone pública inválida');
 const phone=normalizeWhatsapp(input.country_code,input.calling_code,input.whatsapp_number),match=resolvePerson(state,phone.whatsapp_e164),stamp=now();
 const request={request_id:uid('booking'),slot_id:slot.slot_id,requested_start_at:slot.start_at,requested_end_at:slot.end_at,timezone:PUBLIC_TIMEZONE,timezone_label:PUBLIC_TIMEZONE_LABEL,...phone,...match,email:match.email,status:'PENDING_REVIEW',classification:{relationship_type:match.relationship_type,appointment_category:null,related_axis:null,related_object:null,notes:null,economic_model:'MANUAL/TBD',modality:null,priority:'NORMAL',owner:'Osvaldo'},source:'local-demo/public-booking',last_update:stamp,demo:true};
 slot.status='HELD_PENDING_REVIEW';slot.request_id=request.request_id;slot.last_update=stamp;state.booking_requests.push(request);appendBookingNotification(state,'BOOKING_REQUESTED',request,{occurredAt:stamp});state.activity.unshift({object_id:null,summary:'Solicitud de cita recibida · pendiente de revisión',source:request.source,last_update:stamp,demo:true});return request;
}
export function addConfirmationEmail(state,requestId,email){
 const request=byRequest(state,requestId);if(!request)throw Error('Solicitud desconocida');
 if(request.email)return request;
 const value=String(email||'').trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))throw Error('Escribe un correo válido para la confirmación');
 request.email=value;request.email_source='provided_after_request';request.last_update=now();return request;
}
export function classify(state,id,classification){
 const request=byRequest(state,id);if(!request)throw Error('Solicitud desconocida');
 if(classification.economic_model&&!ECONOMIC_MODELS.includes(classification.economic_model))throw Error('Modelo económico inválido');
 const allowed=['relationship_type','appointment_category','related_axis','related_object','notes','economic_model','modality','priority','owner'];
 for(const key of allowed)if(key in classification)request.classification[key]=String(classification[key]||'').trim()||null;
 request.last_update=now();return request;
}
function emailDemo(state,request,type){
 if(!request.email)return null;
 const email={email_id:uid('email-demo'),request_id:request.request_id,to:request.email,type,status:'EMAIL = NOT ACTUALLY SENT',appointment_status:request.status,date_time_label:formatSlot(request.requested_start_at),timezone:PUBLIC_TIMEZONE,timezone_label:PUBLIC_TIMEZONE_LABEL,created_at:now(),source:'local-demo/email-preview',demo:true};state.email_demos.push(email);return email;
}
function canonicalEvent(state,request){
 const current=state.events.find(event=>event.metadata?.booking_request_id===request.request_id),stamp=now();
 const event={event_id:current?.event_id||uid('event'),title:'Cita con Osvaldo · DEMO',start_at:request.requested_start_at,end_at:request.requested_end_at,timezone:PUBLIC_TIMEZONE,event_type:'APPOINTMENT',status:'ACTIVE',visibility:'OPERATOR',origin:'local-demo/accepted-booking',created_at:current?.created_at||stamp,updated_at:stamp,metadata:{demo:true,all_day:false,booking_request_id:request.request_id,person_ref:request.person_ref}};
 if(current)state.events[state.events.indexOf(current)]=event;else state.events.push(event);
 const currentAppointment=state.appointments.find(item=>item.request_id===request.request_id),appointment={appointment_id:currentAppointment?.appointment_id||uid('appointment'),request_id:request.request_id,event_id:event.event_id,start_at:request.requested_start_at,end_at:request.requested_end_at,timezone:PUBLIC_TIMEZONE,status:'CONFIRMED',source:'local-demo/accepted-booking',updated_at:stamp,demo:true};if(currentAppointment)state.appointments[state.appointments.indexOf(currentAppointment)]=appointment;else state.appointments.push(appointment);return event;
}
export function acceptBooking(state,id){
 const request=byRequest(state,id),slot=request&&bySlot(state,request.slot_id);if(!request||!['PENDING_REVIEW','MODIFIED'].includes(request.status)||request.appointment_event_id||!slot)throw Error('La solicitud ya no puede aceptarse');
 request.status='ACCEPTED';slot.status='OCCUPIED';request.appointment_event_id=canonicalEvent(state,request).event_id;request.status='CONFIRMED';request.last_update=now();appendBookingNotification(state,'BOOKING_ACCEPTED',request,{sequence:2,occurredAt:request.last_update});emailDemo(state,request,'BOOKING_CONFIRMED');return request;
}
export function modifyBooking(state,id,newSlotId){
 const request=byRequest(state,id),old=request&&bySlot(state,request.slot_id),next=bySlot(state,newSlotId);if(!request||!['PENDING_REVIEW','CONFIRMED','MODIFIED'].includes(request.status)||!next||next.status!=='AVAILABLE')throw Error('No se puede usar ese horario');
 if(old){old.status='AVAILABLE';delete old.request_id;old.last_update=now();}
 next.status=request.status==='PENDING_REVIEW'?'HELD_PENDING_REVIEW':'OCCUPIED';next.request_id=request.request_id;request.slot_id=next.slot_id;request.requested_start_at=next.start_at;request.requested_end_at=next.end_at;request.status='MODIFIED';request.last_update=now();
 if(request.appointment_event_id)canonicalEvent(state,request);const modificationCount=(state.notification_outbox||[]).filter(row=>row.request_id===request.request_id&&row.event_type==='BOOKING_MODIFIED').length;appendBookingNotification(state,'BOOKING_MODIFIED',request,{sequence:modificationCount+2,occurredAt:request.last_update});emailDemo(state,request,'BOOKING_UPDATED');return request;
}
export function rejectBooking(state,id,reason=''){
 const request=byRequest(state,id),slot=request&&bySlot(state,request.slot_id);if(!request||!['PENDING_REVIEW','MODIFIED'].includes(request.status))throw Error('La solicitud ya no puede rechazarse');
 if(slot){slot.status='AVAILABLE';delete slot.request_id;slot.last_update=now();}request.status='REJECTED';request.internal_reason=String(reason).trim()||null;request.last_update=now();return request;
}
export function cancelBooking(state,id){
 const request=byRequest(state,id),slot=request&&bySlot(state,request.slot_id);if(!request||!['CONFIRMED','MODIFIED'].includes(request.status))throw Error('La cita no puede cancelarse');
 if(slot){slot.status='AVAILABLE';delete slot.request_id;slot.last_update=now();}request.status='CANCELLED';request.last_update=now();const event=state.events.find(event=>event.metadata?.booking_request_id===id);if(event){event.status='CANCELLED';event.updated_at=request.last_update;}const appointment=state.appointments.find(item=>item.request_id===id);if(appointment){appointment.status='CANCELLED';appointment.updated_at=request.last_update;}appendBookingNotification(state,'BOOKING_CANCELLED',request,{sequence:3,occurredAt:request.last_update});emailDemo(state,request,'BOOKING_CANCELLED');return request;
}
export function formatSlot(iso){return new Intl.DateTimeFormat('es-MX',{timeZone:PUBLIC_TIMEZONE,day:'numeric',month:'short',hour:'numeric',minute:'2-digit',hour12:true}).format(new Date(iso))+' — '+PUBLIC_TIMEZONE_LABEL;}
export function assertBookingState(state){for(const request of state.booking_requests)if(!BOOKING_STATUSES.includes(request.status))throw Error('Estado de reserva inválido');return true;}
