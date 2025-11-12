document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn    = form?.querySelector('button[type="submit"]');

  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending...';
    status.className   = 'form-status sending';
    if (btn) btn.disabled = true;

    const formData = new FormData(form);

    try {
      const res  = await fetch(form.action, { method: 'POST', body: formData });
      const json = await res.json();

      if (json.success) {
        status.textContent = 'Thank you — your message has been sent!';
        status.className   = 'form-status success';
        form.reset();
      } else {
        status.textContent = `Error: ${json.message || 'Please try again.'}`;
        status.className   = 'form-status error';
      }
    } catch (err) {
      console.error(err);
      status.textContent = 'Network error — please try again later.';
      status.className   = 'form-status error';
    } finally {
      if (btn) btn.disabled = false;
    }
  });
});
