'use strict';

// The directory shares the same doctor records as patient discovery and checkout.
const adminDoctorWeekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function adminDoctorLanguages(d) {
  return Array.isArray(d.languages) ? d.languages : String(d.languages || 'English, Hindi').split(',').map(v => v.trim()).filter(Boolean);
}

function adminDoctorBookings(d) {
  return state.appointments.filter(a => a.doctor === d.id).length;
}

function adminDoctorStatus(d) {
  const status = ['Approved', 'Pending', 'Rejected'].includes(d.status) ? d.status : 'Pending';
  return `<span class="doctor-admin-status doctor-admin-status-${status.toLowerCase()}">${icon(status === 'Approved' ? 'check' : 'clock')}${esc(status)}</span><span class="doctor-admin-account ${d.blocked ? 'is-blocked' : ''}"><i></i>${d.blocked ? 'Blocked account' : 'Active account'}</span>`;
}

function adminDoctorInfo(label, value, className = '') {
  return `<div class="doctor-admin-info ${className}"><dt>${esc(label)}</dt><dd>${esc(value || 'Not added')}</dd></div>`;
}

function adminDoctorCard(d) {
  const days = Array.isArray(d.days) ? d.days : [];
  return `<article class="doctor-admin-card" data-doctor-id="${esc(d.id)}">
    <div class="doctor-admin-card-top"><div class="doctor-admin-identity">${doctorAvatar(d)}<div><span class="doctor-admin-speciality">${esc(d.speciality)}</span><h3>${esc(d.name)}</h3><p>${esc(d.qualification)} <span aria-hidden="true">·</span> ${esc(d.experience)} years experience</p></div></div><div class="doctor-admin-fee"><strong>${money(d.fee)}</strong><span>per consultation</span></div></div>
    <div class="doctor-admin-status-row">${adminDoctorStatus(d)}</div>
    <dl class="doctor-admin-info-grid">
      ${adminDoctorInfo('Mobile number', d.mobile)}
      ${adminDoctorInfo('Medical registration', d.registration)}
      ${adminDoctorInfo('Clinic', d.clinic)}
      ${adminDoctorInfo('City', d.city)}
      ${adminDoctorInfo('Working days', days.length ? days.join(', ') : 'No working days set')}
      ${adminDoctorInfo('Consultation hours', `${d.start || '09:00'} – ${d.end || '17:00'} · ${d.duration || 30} min slots`)}
      ${adminDoctorInfo('Languages', adminDoctorLanguages(d).join(', '))}
      ${adminDoctorInfo('Total appointments', String(adminDoctorBookings(d)))}
    </dl>
    <footer class="doctor-admin-card-footer"><span>${icon('shield')} ${d.status === 'Approved' && !d.blocked ? 'Visible in the patient app' : 'Hidden from patient discovery'}</span><div>${btn('Details', 'admin-doctor-details', `data-id="${esc(d.id)}"`, 'secondary')}${btn(icon('profile') + ' Edit doctor', 'admin-doctor-edit', `data-id="${esc(d.id)}"`, 'secondary')}</div></footer>
  </article>`;
}

function adminDoctorsView() {
  const doctors = state.doctors;
  const active = doctors.filter(d => d.status === 'Approved' && !d.blocked).length;
  const pending = doctors.filter(d => d.status === 'Pending').length;
  const list = doctors.filter(d => match({ name: d.name, speciality: d.speciality, qualification: d.qualification, mobile: d.mobile, registration: d.registration, clinic: d.clinic, city: d.city, fee: d.fee, status: d.status }));
  return `<div class="admin-doctors">
    <div class="doctor-admin-intro"><div><h3>Your care team, in one place</h3><p>Manage profiles, availability and consultation charges.</p></div>${btn('<span aria-hidden="true">+</span> Add doctor', 'admin-doctor-add')}</div>
    <div class="doctor-admin-summary"><span><strong>${doctors.length}</strong> Total doctors</span><span><i class="doctor-admin-dot"></i><strong>${active}</strong> Active & approved</span><span><i class="doctor-admin-dot is-pending"></i><strong>${pending}</strong> Pending verification</span></div>
    <div class="doctor-admin-search">${adminToolbar()}<p>${list.length} ${list.length === 1 ? 'doctor' : 'doctors'}${adminSearch ? ' found' : ' in your directory'}</p></div>
    <div class="doctor-admin-directory">${list.map(adminDoctorCard).join('') || `<div class="doctor-admin-empty">${icon('search')}<h3>No doctors found</h3><p>Try a name, speciality, city or registration number.</p>${btn('Clear search', 'admin-doctor-clear-search', '', 'secondary')}</div>`}</div>
    <p class="doctor-admin-footnote">${icon('record')} Consultation charges apply to new bookings. Existing appointment receipts keep their original charges.</p>
  </div>`;
}

function adminDoctorDetails(id) {
  const d = state.doctors.find(item => item.id === id);
  if (!d) { toast('This doctor could not be found.'); return; }
  const days = Array.isArray(d.days) ? d.days : [];
  dialog('Doctor details', `<div class="doctor-admin-detail">
    <div class="doctor-admin-detail-profile">${doctorAvatar(d)}<div><span class="doctor-admin-speciality">${esc(d.speciality)}</span><h3>${esc(d.name)}</h3><p>${esc(d.qualification)}</p></div></div>
    <div class="doctor-admin-status-row">${adminDoctorStatus(d)}</div>
    <div class="doctor-admin-detail-charge"><div><span>Consultation charge</span><strong>${money(d.fee)}</strong></div><p>Current price shown to patients for new appointments.</p></div>
    <dl class="doctor-admin-info-grid">
      ${adminDoctorInfo('Experience', `${d.experience} years`)}
      ${adminDoctorInfo('Mobile number', d.mobile)}
      ${adminDoctorInfo('Medical registration', d.registration, 'doctor-admin-wide')}
      ${adminDoctorInfo('Clinic', d.clinic)}
      ${adminDoctorInfo('City', d.city)}
      ${adminDoctorInfo('Working days', days.join(', '), 'doctor-admin-wide')}
      ${adminDoctorInfo('Consultation hours', `${d.start || '09:00'} – ${d.end || '17:00'}`)}
      ${adminDoctorInfo('Appointment duration', `${d.duration || 30} minutes`)}
      ${adminDoctorInfo('Languages', adminDoctorLanguages(d).join(', '))}
      ${adminDoctorInfo('Total appointments', String(adminDoctorBookings(d)))}
      ${adminDoctorInfo('About the doctor', d.bio || 'No introduction added yet.', 'doctor-admin-wide')}
      ${d.photoFilename ? adminDoctorInfo('Profile photograph', d.photoFilename, 'doctor-admin-wide') : ''}
    </dl>
    ${btn('Edit doctor profile', 'admin-doctor-edit', `data-id="${esc(d.id)}"`)}
  </div>`);
}

function adminDoctorForm(id = '') {
  const existing = id ? state.doctors.find(d => d.id === id) : null;
  if (id && !existing) { toast('This doctor could not be found.'); return; }
  const d = existing || { name: '', mobile: '', qualification: '', experience: '', registration: '', speciality: '', fee: '', clinic: '', city: '', languages: ['English', 'Hindi'], bio: '', status: 'Approved', blocked: false, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], start: '09:00', end: '17:00', duration: 30 };
  const specialities = [...new Set(state.doctors.map(item => item.speciality))];
  dialog(existing ? 'Edit doctor' : 'Add a doctor', `<form id="admin-doctor-form" class="doctor-admin-form" data-id="${esc(id)}">
    <p class="doctor-admin-form-intro">${existing ? 'Keep the doctor’s profile and patient booking information up to date.' : 'Add a care professional and set the charges patients will see.'}</p>
    <div class="doctor-admin-photo-upload"><div id="admin-doctor-photo-preview">${existing ? doctorAvatar(existing) : `<span class="doctor-admin-photo-placeholder">${icon('doctor')}</span>`}</div><label>Profile photograph<input type="file" name="photo" accept="image/jpeg,image/png,image/webp"><span>JPG, PNG or WebP · up to 1 MB. ${existing ? 'Leave empty to keep the current photo.' : 'A clear portrait works best.'}</span></label></div>
    <fieldset><legend>Professional information</legend><div class="doctor-admin-form-grid">
      ${field('Doctor’s full name', 'name', d.name, 'text', 'required minlength="2" maxlength="80" autocomplete="name" placeholder="Dr. Aditi Mehta"')}
      ${field('Mobile number', 'mobile', d.mobile, 'tel', 'required pattern="[6-9][0-9]{9}" maxlength="10" inputmode="numeric" autocomplete="tel-national" placeholder="10-digit mobile number"')}
      ${field('Speciality', 'speciality', d.speciality, 'text', 'required minlength="2" maxlength="80" list="admin-doctor-specialities" placeholder="e.g. Cardiologist"')}
      <datalist id="admin-doctor-specialities">${specialities.map(value => `<option value="${esc(value)}"></option>`).join('')}</datalist>
      ${field('Qualifications', 'qualification', d.qualification, 'text', 'required minlength="2" maxlength="120" placeholder="e.g. MBBS, MD"')}
      ${field('Experience in years', 'experience', d.experience, 'number', 'required min="0" max="60" step="1" inputmode="numeric" placeholder="e.g. 10"')}
      ${field('Medical registration number', 'registration', d.registration, 'text', 'required minlength="3" maxlength="60" placeholder="Enter registration number"')}
    </div></fieldset>
    <fieldset><legend>Consultation & location</legend><div class="doctor-admin-form-grid">
      <div class="doctor-admin-fee-input">${field('Consultation charge (₹)', 'fee', d.fee, 'number', 'required min="0" max="100000" step="1" inputmode="numeric" placeholder="e.g. 500"')}<small>Shown in the patient app and used for new bookings.</small></div>
      ${field('Clinic name', 'clinic', d.clinic || '', 'text', 'required minlength="2" maxlength="120" placeholder="e.g. My Doctor Clinic"')}
      ${field('City', 'city', d.city || '', 'text', 'required minlength="2" maxlength="80" placeholder="e.g. Pune"')}
      ${field('Languages spoken', 'languages', adminDoctorLanguages(d).join(', '), 'text', 'required maxlength="120" placeholder="English, Hindi"')}
      <label class="doctor-admin-wide">About the doctor<textarea name="bio" maxlength="800" rows="3" placeholder="A short introduction to their care and experience">${esc(d.bio || '')}</textarea></label>
    </div></fieldset>
    <fieldset><legend>Weekly availability</legend><div class="doctor-admin-working-days"><span>Working days</span><div>${adminDoctorWeekdays.map(value => `<label><input type="checkbox" name="days" value="${value}" ${(d.days || []).includes(value) ? 'checked' : ''}><span>${value}</span></label>`).join('')}</div></div><div class="doctor-admin-form-grid doctor-admin-time-grid">
      ${field('Starts at', 'start', d.start || '09:00', 'time', 'required')}
      ${field('Ends at', 'end', d.end || '17:00', 'time', 'required')}
      ${select('Slot duration', 'duration', [[15, '15 minutes'], [20, '20 minutes'], [30, '30 minutes'], [45, '45 minutes'], [60, '60 minutes']], Number(d.duration) || 30)}
    </div></fieldset>
    <fieldset><legend>Profile access</legend><div class="doctor-admin-form-grid">
      ${select('Verification status', 'status', ['Approved', 'Pending', 'Rejected'], d.status)}
      ${select('Account status', 'accountStatus', ['Active', 'Blocked'], d.blocked ? 'Blocked' : 'Active')}
    </div><p class="doctor-admin-access-note">Only approved doctors with an active account appear in patient search.</p></fieldset>
    <div class="doctor-admin-form-actions">${btn('Cancel', 'close', 'type="button"', 'secondary')}${btn(existing ? 'Save doctor' : 'Add doctor', 'admin-doctor-submit', 'type="submit"')}</div>
  </form>`);
}

async function adminDoctorReadPhoto(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG or WebP profile photograph.');
  if (file.size > 1024 * 1024) throw new Error('Choose a profile photograph of 1 MB or less.');
  if (!file.size) throw new Error('This image file is empty. Please choose another photograph.');
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => bytes[index] === byte);
  const isWebp = String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  if (!({ 'image/jpeg': isJpeg, 'image/png': isPng, 'image/webp': isWebp })[file.type]) throw new Error('The image contents must match its JPG, PNG or WebP file type.');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Unable to read this image. Please try another photograph.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('This file is not a valid photograph. Please choose another image.'));
      image.onload = () => resolve(reader.result);
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

document.addEventListener('click', e => {
  const button = e.target.closest('[data-action^="admin-doctor-"]');
  if (!button || role !== 'admin') return;
  const id = button.dataset.id || '';
  switch (button.dataset.action) {
    case 'admin-doctor-add': adminDoctorForm(); break;
    case 'admin-doctor-edit': adminDoctorForm(id); break;
    case 'admin-doctor-details': adminDoctorDetails(id); break;
    case 'admin-doctor-clear-search': adminSearch = ''; render(); break;
  }
});

document.addEventListener('change', async e => {
  if (e.target.name !== 'photo' || e.target.form?.id !== 'admin-doctor-form' || role !== 'admin') return;
  const input = e.target, form = input.form;
  const file = input.files?.[0];
  const version = String((Number(input.dataset.previewVersion) || 0) + 1);
  input.dataset.previewVersion = version;
  const preview = document.getElementById('admin-doctor-photo-preview');
  const currentSelection = () => input.isConnected && modal.open && modal.contains(form) && role === 'admin' && input.files?.[0] === file && input.dataset.previewVersion === version;
  const restorePhoto = () => {
    if (!currentSelection() || !preview?.isConnected) return;
    const existing = state.doctors.find(d => d.id === form.dataset.id);
    preview.innerHTML = existing ? doctorAvatar(existing) : `<span class="doctor-admin-photo-placeholder">${icon('doctor')}</span>`;
  };
  if (!file) { restorePhoto(); return; }
  try {
    const photo = await adminDoctorReadPhoto(file);
    if (currentSelection() && preview?.isConnected) preview.innerHTML = `<span class="avatar doctor-avatar"><img src="${esc(photo)}" alt="Selected profile photograph"></span>`;
  } catch (error) {
    if (!currentSelection()) return;
    input.value = '';
    if (preview?.isConnected) {
      const existing = state.doctors.find(d => d.id === form.dataset.id);
      preview.innerHTML = existing ? doctorAvatar(existing) : `<span class="doctor-admin-photo-placeholder">${icon('doctor')}</span>`;
    }
    toast(error.message);
  }
});

document.addEventListener('submit', async e => {
  const form = e.target;
  if (form.id !== 'admin-doctor-form') return;
  e.preventDefault();
  if (role !== 'admin' || form.dataset.saving === 'true') return;
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const data = new FormData(form);
  const id = form.dataset.id;
  const existing = id ? state.doctors.find(d => d.id === id) : null;
  if (id && !existing) { toast('This doctor could not be found. Reopen the directory and try again.'); return; }
  const clean = name => String(data.get(name) || '').trim().replace(/\s+/g, ' ');
  const name = clean('name').replace(/^dr(?:\.\s*|\s+)/i, '');
  const mobile = clean('mobile');
  const registration = clean('registration').toUpperCase();
  const registrationKey = value => String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const requiredText = ['qualification', 'speciality', 'clinic', 'city', 'languages'];
  if (name.length < 2 || !/\p{L}/u.test(name) || requiredText.some(key => clean(key).length < 2)) { toast('Please enter a complete name, speciality, qualifications, clinic, city and languages.'); return; }
  if (!/^[6-9][0-9]{9}$/.test(mobile)) { toast('Enter a valid 10-digit Indian mobile number.'); return; }
  if (registrationKey(registration).length < 3) { toast('Enter a valid medical registration number.'); return; }
  if (state.doctors.some(d => d.id !== id && d.mobile === mobile)) { toast('This mobile number is already assigned to another doctor.'); return; }
  if (state.doctors.some(d => d.id !== id && registrationKey(d.registration) === registrationKey(registration))) { toast('This medical registration number is already assigned to another doctor.'); return; }
  const fee = Number(data.get('fee'));
  const experience = Number(data.get('experience'));
  if (!Number.isInteger(fee) || fee < 0 || fee > 100000) { toast('Enter a consultation charge from ₹0 to ₹1,00,000 in whole rupees.'); return; }
  if (!Number.isInteger(experience) || experience < 0 || experience > 60) { toast('Experience must be a whole number between 0 and 60 years.'); return; }
  const days = [...new Set(data.getAll('days'))].filter(value => adminDoctorWeekdays.includes(value));
  const start = clean('start'), end = clean('end'), duration = Number(data.get('duration'));
  const toMinutes = value => { const [hours, minutes] = value.split(':').map(Number); return hours * 60 + minutes; };
  if (!days.length || !/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end) || end <= start || ![15, 20, 30, 45, 60].includes(duration) || toMinutes(end) - toMinutes(start) < duration) { toast('Choose working days and a closing time at least one slot after the opening time.'); return; }
  const languages = [...new Set(clean('languages').split(',').map(value => value.trim()).filter(Boolean))];
  if (!languages.length) { toast('Add at least one language spoken by the doctor.'); return; }
  const status = clean('status');
  const accountStatus = clean('accountStatus');
  if (!['Approved', 'Pending', 'Rejected'].includes(status) || !['Active', 'Blocked'].includes(accountStatus)) { toast('Choose valid verification and account statuses.'); return; }
  const submit = form.querySelector('button[type="submit"]');
  form.dataset.saving = 'true';
  submit.disabled = true;
  const submitLabel = submit.textContent;
  submit.textContent = 'Saving doctor…';
  const activeForm = () => form.isConnected && modal.open && modal.contains(form) && role === 'admin';
  try {
    const photoFile = data.get('photo');
    let photo = existing?.photo || '';
    if (photoFile && photoFile.size) photo = await adminDoctorReadPhoto(photoFile);
    if (!activeForm()) return;
    const record = {
      ...(existing || {}), id: existing?.id || uid('DOC'), name: 'Dr. ' + name,
      mobile, qualification: clean('qualification'), experience, registration,
      speciality: clean('speciality'), fee, clinic: clean('clinic'), city: clean('city'), languages,
      bio: String(data.get('bio') || '').trim(), status, blocked: accountStatus === 'Blocked',
      days, start, end, duration, photo,
      ...(photoFile?.size ? { photoFilename: photoFile.name, photoUploadedAt: new Date().toISOString() } : {}),
      ...(status === 'Approved' ? { rejection: '' } : {})
    };
    // Persist a complete candidate before mutating the shared state, so storage
    // quota errors do not leave a newly uploaded profile only in memory.
    const doctors = existing ? state.doctors.map(d => d.id === id ? record : d) : [...state.doctors, record];
    localStorage.setItem(KEY, JSON.stringify({ ...state, doctors }));
    state.doctors = doctors;
    audit(existing ? 'Doctor profile and consultation charge updated' : 'Doctor added by admin', 'Doctors', record.id);
    save();
    modal.close();
    render();
    toast(existing ? 'Doctor saved. New bookings will use the updated charge.' : 'Doctor added to your directory.');
  } catch (error) {
    if (!activeForm()) return;
    toast(error.name === 'QuotaExceededError' ? 'Browser storage is full. Choose a smaller photograph and try again.' : error.message || 'Unable to save this doctor. Please try again.');
  } finally {
    if (form.isConnected) { form.dataset.saving = 'false'; submit.disabled = false; submit.textContent = submitLabel; }
  }
});
