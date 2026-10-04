import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';

test('booking público e interno conserva timezone, país no cambia horas y crea cita sólo al aceptar',{timeout:120000},async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),context=await browser.newContext({viewport:{width:1440,height:1100},timezoneId:'Europe/Madrid'}),page=await context.newPage(),errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173'))external.push(r.url());});
 try{
  await page.goto('http://127.0.0.1:4173/#reservar');await page.locator('#booking-public-form').waitFor();
  const warning='Todos los horarios se muestran en hora de Ciudad de México. Si estás en otro país, considera la diferencia horaria antes de solicitar tu cita.';
  assert.equal(await page.getByText(warning,{exact:true}).count(),1);
  const slotsBefore=await page.locator('.slot-option').allTextContents();await page.locator('[name="slot_id"]').first().check();const selectedBefore=await page.locator('#booking-selected-summary').innerText();
  await page.locator('#booking-country').selectOption('US');assert.equal(await page.locator('[name="calling_code"]').inputValue(),'+1');assert.deepEqual(await page.locator('.slot-option').allTextContents(),slotsBefore);assert.equal(await page.locator('#booking-selected-summary').innerText(),selectedBefore);
  await page.locator('[name="whatsapp_number"]').fill('415 555 0101');await page.getByRole('button',{name:'SOLICITAR CITA',exact:true}).click();
  assert.match(await page.locator('main').innerText(),/SOLICITUD RECIBIDA \/ PENDIENTE DE REVISIÓN/);assert.match(await page.locator('main').innerText(),/\+14155550101/);assert.match(await page.locator('main').innerText(),/hora de Ciudad de México/);
  await page.locator('#booking-email-form [name="email"]').fill('visitante@example.invalid');await page.getByRole('button',{name:'Guardar correo',exact:true}).click();
  await mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/booking-public.png',fullPage:true});
  await page.getByRole('link',{name:'SOLICITUDES DE CITA',exact:true}).click();await page.locator('[data-booking-request]').waitFor();assert.match(await page.locator('main').innerText(),/UNRESOLVED \/ NEW/);
  await page.locator('[name="appointment_category"]').fill('Exploración');await page.locator('[name="economic_model"]').selectOption('MANUAL/TBD');await page.getByRole('button',{name:'Guardar clasificación interna',exact:true}).click();
  await page.getByRole('button',{name:'MODIFY',exact:true}).click();await page.locator('#modify-booking-form [name="slot_id"]').selectOption({index:0});await page.getByRole('button',{name:'Guardar modificación DEMO',exact:true}).click();assert.match(await page.locator('[data-booking-request] h2').innerText(),/hora de Ciudad de México/);
  await page.getByRole('button',{name:'ACCEPT',exact:true}).click();assert.match(await page.locator('[data-booking-request]').innerText(),/CONFIRMED/);const confirmation=page.locator('.email-demo').filter({hasText:'BOOKING_CONFIRMED'});assert.match(await confirmation.innerText(),/BOOKING_CONFIRMED/);assert.match(await confirmation.innerText(),/hora de Ciudad de México/);
  await page.screenshot({path:'artifacts/booking-internal.png',fullPage:true});
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('torre-v01-demo-v1')).state);assert.equal(saved.booking_requests.length,1);assert.equal(saved.appointments.length,1);assert.equal(saved.events.filter(e=>e.event_type==='APPOINTMENT').length,1);assert.equal(saved.booking_slots.find(s=>s.slot_id===saved.booking_requests[0].slot_id).status,'OCCUPIED');
  await page.getByRole('link',{name:'CALENDARIO',exact:true}).click();await page.locator('.fc-timeGridWeek-view').waitFor();await page.locator('#open-date').fill(saved.booking_requests[0].requested_start_at.slice(0,10));await page.getByRole('button',{name:'Abrir fecha',exact:true}).click();await page.getByRole('button',{name:'Cerrar evento',exact:true}).click();await page.locator('.fc-event').filter({hasText:'Cita con Osvaldo'}).waitFor();assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 }finally{await browser.close();}
});
