document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn    = form?.querySelector('button[type="submit"]');

  if (!form || !status) return;

  function showMailFly() {
    const mail = document.getElementById('mail-fly');
    if (!mail) return;
    mail.classList.remove('show'); // restart if mid-flight
    // force reflow so the animation resets
    // eslint-disable-next-line no-unused-expressions
    mail.offsetWidth;
    mail.classList.add('show');
    mail.addEventListener('animationend', () => {
      mail.classList.remove('show');
    }, { once: true });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameVal    = form.querySelector('[name="name"]')?.value?.trim();
    const emailVal   = form.querySelector('[name="email"]')?.value?.trim();
    const subjectVal = form.querySelector('[name="subject"]')?.value?.trim();
    const messageVal = form.querySelector('[name="message"]')?.value?.trim();

    if (!nameVal || !emailVal || !subjectVal || !messageVal) {
      status.textContent = 'Please fill in all fields.';
      status.className = 'form-status error';
      return;
    }

    // Instant feedback: animate + optimistic status
    showMailFly();
    status.textContent = 'Sent! (verifying…)';
    status.className = 'form-status success';
    btn?.classList.add('is-loading');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // fail fast at 12s

    try {
      const formData = new FormData(form);
      const resp = await fetch(form.action, { method: 'POST', body: formData, signal: controller.signal });
      clearTimeout(timeout);

      const result = await resp.json();

      if (result.success) {
        // keep the optimistic success, just tidy up
        form.reset();
      } else {
        status.textContent = 'Oops, something went wrong. ' + (result.message || 'Please try again later.');
        status.className = 'form-status error';
      }
    } catch (err) {
      status.textContent = (err.name === 'AbortError')
        ? 'Taking longer than usual. We’ll keep trying…'
        : 'Network error. Please try again.';
      status.className = 'form-status error';
      console.error(err);
    } finally {
      btn?.classList.remove('is-loading');
    }
  });

  // Optional manual test in console: window.testMailFly()
  window.testMailFly = showMailFly;
});
