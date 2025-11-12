document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn    = form?.querySelector('button[type="submit"]');

  if (!form || !status) return;

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

    status.textContent = 'Sending...';
    status.className = 'form-status sending';
    if (btn) { btn.disabled = true; btn.style.opacity = '0.7'; }

    try {
      const formData = new FormData(form);
      const resp = await fetch(form.action, { method: 'POST', body: formData });
      const result = await resp.json();

      if (result.success) {
        status.textContent = 'Thank you — your message has been sent!';
        status.className = 'form-status success';
        form.reset();

        // ✉️ STEP 3: Trigger the flying-mail animation
        const mail = document.getElementById('mail-fly');
        if (mail) {
          mail.classList.add('show');
          mail.addEventListener('animationend', () => {
            mail.classList.remove('show'); // clean up after flight
          }, { once: true });
        }
        // ✉️ END animation block
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
});
