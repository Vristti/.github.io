document.addEventListener('DOMContentLoaded', function () {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  function setStatus(text, cls) {
    if (!status) return;
    status.textContent = text;
    status.className = 'form-status ' + (cls || '');
  }

  // Guard: is the form present?
  if (!form || !status) {
    console.error('Contact form or status element not found.');
    return;
  }

  // Guard: is EmailJS library present?
  if (typeof window.emailjs === 'undefined') {
    setStatus('EmailJS library did not load. Check the script tag.', 'error');
    return;
  }

  // Init EmailJS (v4 syntax)
  try {
    emailjs.init({ publicKey: 'BPvosCZTH0733SKkE' });
  } catch (e) {
    console.error('EmailJS init failed:', e);
    setStatus('EmailJS init failed: ' + (e?.message || ''), 'error');
    return;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Grab values explicitly
    const from_name  = form.querySelector('[name="from_name"]')?.value?.trim()  || '';
    const from_email = form.querySelector('[name="from_email"]')?.value?.trim() || '';
    const subject    = form.querySelector('[name="subject"]')?.value?.trim()    || '';
    const message    = form.querySelector('[name="message"]')?.value?.trim()    || '';

    if (!from_name || !from_email || !subject || !message) {
      setStatus('Please fill in all fields.', 'error');
      return;
    }

    setStatus('Sending...', 'sending');

    const serviceID  = 'service_t4eg3fu';
    const templateID = 'template_aosbp1n';

    try {
      // Send simple JSON payload (more reliable than sendForm)
      const resp = await emailjs.send(serviceID, templateID, {
        from_name,
        from_email,
        subject,
        message,
        // Add common optional vars in case your template expects them:
        to_name: 'Vristti',
        reply_to: from_email
      });

      setStatus('Thank you — your message has been sent!', 'success');
      form.reset();
    } catch (err) {
      // Show the real error (stringify safely)
      let detail = '';
      try {
        if (err?.text) detail = ` (${err.text})`;
        else if (err?.message) detail = ` (${err.message})`;
        else detail = ` (${JSON.stringify(err)})`;
      } catch (_) {
        detail = '';
      }
      console.error('EmailJS error:', err);
      setStatus('Oops, something went wrong. Please email me directly at vristti.jalan@gmail.com.' + detail, 'error');
    }
  });
});
