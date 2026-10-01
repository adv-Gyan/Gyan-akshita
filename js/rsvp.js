/**
 * RSVP.JS — Google Sheets submission handling
 */
(function () {
  'use strict';

  const form = document.getElementById('rsvp-form');
  const submitBtn = document.getElementById('rsvp-submit');
  const successDiv = document.getElementById('rsvp-success');
  if (!form || !submitBtn || !successDiv) return;

  const attendingInputs = Array.from(form.querySelectorAll('input[name="attending"]'));
  const dateGroup = document.getElementById('rsvp-date-group');
  const dateInput = document.getElementById('rsvp-date');
  const dateTrigger = document.getElementById('rsvp-date-trigger');
  const dateDisplay = document.getElementById('rsvp-date-display');
  const calendarPopover = document.getElementById('rsvp-calendar-popover');
  const calendarDays = document.getElementById('rsvp-calendar-days');
  const endpoint = String(window.weddingData?.rsvp?.webAppUrl || '').trim();

  const YEAR = 2026;
  const MONTH = 10;
  const CELEBRATION_DATES = new Set([19, 20, 21]);

  attendingInputs.forEach(input => input.addEventListener('change', syncDateRequirement));
  initCalendar();
  syncDateRequirement();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = collectData();
    if (!validateForm(data)) return;

    if (!endpoint) {
      showError('RSVP is being connected. Please try again shortly.');
      return;
    }
    if (data.website) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending <span aria-hidden="true">· · ·</span>';

    try {
      const body = new URLSearchParams({
        name: data.name,
        phone: data.phone,
        attending: data.attending,
        date: data.date,
        wishes: data.wishes,
        website: ''
      });

      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body,
        cache: 'no-store',
        credentials: 'omit'
      });

      showSuccess(data);
    } catch (error) {
      console.error('RSVP submission failed:', error);
      showError('We could not send your RSVP. Please check your connection and try again.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Confirm My RSVP <span aria-hidden="true">✦</span>';
    }
  });

  function initCalendar() {
    if (!dateTrigger || !calendarPopover || !calendarDays) return;
    renderCalendar();

    dateTrigger.addEventListener('click', () => {
      if (!dateTrigger.disabled) setCalendarOpen(calendarPopover.hidden);
    });

    document.addEventListener('click', event => {
      const calendar = document.getElementById('rsvp-calendar');
      if (calendar && !calendar.contains(event.target)) setCalendarOpen(false);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setCalendarOpen(false);
    });
  }

  function renderCalendar() {
    const firstDay = new Date(YEAR, MONTH, 1).getDay();
    const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
    const selected = dateInput?.value || '';
    calendarDays.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement('span');
      blank.className = 'rsvp-calendar-day is-empty';
      blank.setAttribute('aria-hidden', 'true');
      calendarDays.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const value = formatDate(day);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'rsvp-calendar-day';
      button.dataset.date = value;
      button.textContent = String(day);
      button.setAttribute('aria-label', String(day) + ' November 2026');

      if (CELEBRATION_DATES.has(day)) {
        button.classList.add('is-celebration');
        button.title = day === 19 ? 'Wedding celebrations begin' : day === 20 ? 'Ring Ceremony' : 'Wedding Ceremony';
      }
      if (value === selected) {
        button.classList.add('is-selected');
        button.setAttribute('aria-pressed', 'true');
      }

      button.addEventListener('click', () => selectDate(value, day));
      calendarDays.appendChild(button);
    }
  }

  function formatDate(day) {
    return String(day).padStart(2, '0') + ' November 2026';
  }

  function selectDate(value, day) {
    dateInput.value = value;
    dateInput.dispatchEvent(new Event('change', { bubbles: true }));
    dateDisplay.textContent = String(day) + ' November 2026';
    dateDisplay.classList.add('has-value');
    renderCalendar();
    setCalendarOpen(false);
  }

  function setCalendarOpen(open) {
    if (!calendarPopover || !dateTrigger) return;
    calendarPopover.hidden = !open;
    dateTrigger.setAttribute('aria-expanded', String(open));
    calendarPopover.classList.toggle('is-open', open);
    if (open) renderCalendar();
  }

  function collectData() {
    const attending = form.elements['attending']?.value || '';
    return {
      name: form.elements['name']?.value.trim() || '',
      phone: form.elements['phone']?.value.trim() || '',
      attending,
      date: attending === 'yes' ? (form.elements['date']?.value || '') : 'Not attending',
      wishes: form.elements['message']?.value.trim() || '',
      website: form.elements['website']?.value.trim() || ''
    };
  }

  function validateForm(data) {
    if (!data.name) return invalidate(form.elements['name'], 'Please enter your name.');
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) return invalidate(form.elements['phone'], 'Please enter a valid phone number.');
    if (!data.attending) return invalidate(form.querySelector('input[name="attending"]'), 'Please select an attendance option.');
    if (data.attending === 'yes' && !data.date) return invalidate(dateTrigger, 'Please select the date you will be joining.');
    return true;
  }

  function invalidate(element, message) {
    if (element) {
      shakeField(element);
      if (typeof element.focus === 'function') element.focus();
    }
    showError(message);
    return false;
  }

  function shakeField(element) {
    const target = element.closest('.form-group, .form-fieldset') || element;
    target.classList.remove('rsvp-invalid');
    void target.offsetWidth;
    target.classList.add('rsvp-invalid');
    setTimeout(() => target.classList.remove('rsvp-invalid'), 600);
  }

  function syncDateRequirement() {
    const attendingYes = form.querySelector('input[name="attending"]:checked')?.value === 'yes';
    if (dateGroup) dateGroup.classList.toggle('is-disabled', !attendingYes);
    if (dateInput) {
      dateInput.required = attendingYes;
      if (!attendingYes) {
        dateInput.value = '';
        dateDisplay.textContent = 'Select a date in November';
        dateDisplay.classList.remove('has-value');
        renderCalendar();
        setCalendarOpen(false);
      }
    }
    if (dateTrigger) dateTrigger.disabled = !attendingYes;
  }

  function showError(message) {
    let error = document.getElementById('rsvp-error');
    if (!error) {
      error = document.createElement('p');
      error.id = 'rsvp-error';
      error.className = 'rsvp-error';
      error.setAttribute('role', 'alert');
      form.appendChild(error);
    }
    error.textContent = message;
    error.classList.add('is-visible');
  }

  function showSuccess(data) {
    form.style.display = 'none';
    successDiv.classList.remove('hidden');
    const heading = successDiv.querySelector('.success-heading');
    if (heading && data.name) heading.textContent = 'Thank You, ' + data.name.split(' ')[0] + '!';
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})();