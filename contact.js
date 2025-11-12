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

  // add an abort in case Web3Forms hangs
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const resp = await fetch(form.action, {
    method: 'POST',
    body: formData,
    signal: controller.signal,
    headers: { 'Accept': 'application/json' } // << key fix so Web3Forms returns JSON
  });
  clearTimeout(timeout);

  // be defensive: parse JSON if available
  let result = {};
  try { result = await resp.json(); } catch {}

  if (resp.ok && result.success) {
    form.reset();
    status.textContent = 'Sent! Thanks, I’ll get back to you soon.';
    status.className = 'form-status success';
    showMailFly(); // ✉️ animation
  } else {
    status.textContent = 'Oops, something went wrong. Please try again or email me directly.';
    status.className = 'form-status error';
  }

} catch (err) {
  // Fallback: open the user's email app prefilled (works even if fetch fails)
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

  // Optional manual test in console: window.testMailFly()
  window.testMailFly = showMailFly;
})});;   
