document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form || !status) {
    console.error('Contact form or status element not found.');
    return;
  }

  // ✅ EmailJS v4 recommended init shape
  emailjs.init({ publicKey: 'BPvosCZTH0733SKkE' });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    status.textContent = 'Sending...';
    status.className = 'form-status sending';

    const serviceID = 'service_t4eg3fu';
    const templateID = 'template_aosbp1n';

    try {
      // ✅ Pass the actual form element (more reliable than a selector)
      await emailjs.sendForm(serviceID, templateID, form);

      status.textContent = 'Thank you — your message has been sent!';
      status.className = 'form-status success';
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);

      // Surface the exact EmailJS error so we can see what it is without DevTools
      const msg = (err && (err.text || err.message)) ? ` (${err.text || err.message})` : '';
      status.textContent = 'Oops, something went wrong. Please email me directly at vristti.jalan@gmail.com' + msg;
      status.className = 'form-status error';
    }
  });
});
