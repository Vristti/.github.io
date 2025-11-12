document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn    = form?.querySelector('button[type="submit"]');

  // ✉️ helper: trigger mail animation reliably
  function showMailFly() {
    const mail = document.getElementById('mail-fly');
    if (!mail) return;
    // restart animation if it was mid-flight
    mail.classList.remove('show');
    // force a reflow so the browser sees the class change
    // (this resets the animation timeline)
    // eslint-disable-next-line no-unused-expressions
    mail.offsetWidth;
    mail.classList.add('show');
    mail.addEventListener('animationend', () => {
      mail.classList.remove('show');
    }, { once: true });
  }

  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    /* ... your existing validation and fetch code ... */
    try {
      const formData = new FormData(form);
      const resp = await fetch(form.action, { method: 'POST', body: formData });
      const result = await resp.json();

      if (result.success) {
        status.textContent = 'Thank you — your message has been sent!';
        status.className = 'form-status success';
        form.reset();

        // ✉️ trigger animation on success
        showMailFly();

      } else {
        status.textContent = 'Oops, something went wrong. ' + (result.message || 'Please try again later.');
        status.className = 'form-status error';
      }
    } catch (err) {
      console.error(err);
      status.textContent = 'Network error. Please try again.';
      status.className = 'form-status error';
    } finally {
      if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
    }
  });

  // Optional: expose a manual tester in console
  window.testMailFly = showMailFly;
});
