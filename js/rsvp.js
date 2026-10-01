/**
 * ============================================================
 * RSVP.JS — Google Sheets submission handling
 * ============================================================
 */

(function () {
  'use strict';

  const form = document.getElementById('rsvp-form');
  const submitBtn = document.getElementById('rsvp-submit');
  const successDiv = document.getElementById('rsvp-success');

  if (!form || !submitBtn || !successDiv) return;

  const attendingInputs = Array.from(form.querySelectorAll('input[name="attending"]'));
  const dateGroup = document.getElementById('rsvp-date-group');
  const dateSelect = document.getElementById('rsvp-date');
  const endpoint = String(window.weddingData?.rsvp?.webAppUrl || '').trim();

  attendingInputs.forEach(input => input.addEventListener('change', syncDateRequirement));
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
    if (!data.name) {
      return invalidate(form.elements['name'], 'Please enter your name.');
    }

    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return invalidate(form.elements['phone'], 'Please enter a valid phone number.');
    }

    if (!data.attending) {
      return invalidate(form.querySelector('input[name="attending"]'), 'Please select an attendance option.');
    }

    if (data.attending === 'yes' && !data.date) {
      return invalidate(dateSelect, 'Please select the date you will be joining.');
    }

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
    const attending = form.querySelector('input[name="attending"]:checked')?.value;
    const attendingYes = attending === 'yes';

    if (dateGroup) dateGroup.classList.toggle('is-disabled', !attendingYes);

    if (dateSelect) {
      dateSelect.disabled = !attendingYes;
      dateSelect.required = attendingYes;
      if (!attendingYes) dateSelect.value = '';
    }
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
    if (heading && data.name) {
      heading.textContent = \`Thank You, \${data.name.split(' ')[0]}!\`;
    }

    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

})();