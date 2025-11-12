document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn    = form?.querySelector('button[type="submit"]');

  if (!form || !status) return;

  function showMailFly() {
    const mail = document.getElementById('mail-fly');
    if (!mail) return;

    // restart animation if already mid-flight
    mail.classList.remove('show');
    // force reflow so animation can restart
    // eslint-disable-next-line no-unused-expressions
    mail.offsetWidth;
    mail.classList.add('show');

    const onEnd = () => {
      mail.classList.remove('show');
      mail.removeEventListener('animationend', onEnd);
    };
    mail.addEventListener('animationend', onEnd);
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

    // show loading state (but NOT the success copy yet)
    status.textContent = 'Sending…';
    status.className = 'form-status';
    btn?.classList.add('is-loading');

    // single controller/timeout (don’t redeclare inside try)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const formData = new FormData(form);

      const resp = await fetch(form.action, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: { 'Accept': 'application/json' } // ensures JSON response
      });
      clearTimeout(timeout);

      let result = {};
      try { result = await resp.json(); } catch {}

      if (resp.ok && result.success) {
        form.reset();
        status.textContent = 'Sent! Thanks, I’ll get back to you soon.';
        status.className = 'form-status success';
        showMailFly();                 // ✉️ animate on true success
      } else {
        status.textContent = 'Oops, something went wrong. Please try again or email me directly.';
        status.className = 'form-status error';
      }

    } catch (err) {
      clearTimeout(timeout);

      // graceful fallback: open the user’s mail app prefilled
      const body = encodeURIComponent(
        `Name: ${nameVal}\nEmail: ${emailVal}\n\n${messageVal}`
      );
      const mailto = `mailto:vristti.jalan@gmail.com?subject=${encodeURIComponent(subjectVal)}&body=${body}`;
      try { window.location.href = mailto; } catch {}

      status.textContent = (err.name === 'AbortError')
        ? 'Taking longer than usual—opened your email app as a fallback.'
        : 'Opened your email app as a fallback.';
      status.className = 'form-status success';
      console.error(err);

    } finally {
      btn?.classList.remove('is-loading');
    }
  });

  // Manual test: type testMailFly() in the console to see the ✉️
  window.testMailFly = showMailFly;
});
