document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form || !status) return;

  // 🔑 Initialize EmailJS with your PUBLIC KEY
  emailjs.init({
    publicKey: 'BPvosCZTH0733SKkE', // e.g. 'g4AbCdEf123XYZ'
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    status.textContent = 'Sending...';
    status.className = 'form-status sending';

    // Use your actual IDs here:
    const serviceID = 'service_t4eg3fu';        // from your screenshot
    const templateID = 'template_aosbp1n'; // from Email Templates

    emailjs.sendForm(serviceID, templateID, form)
      .then(function () {
        status.textContent = 'Thank you — your message has been sent!';
        status.className = 'form-status success';
        form.reset();
      })
      .catch(function (error) {
        console.error('EmailJS error:', error);
        status.textContent = 'Oops, something went wrong. Please email me directly at vristti.jalan@gmail.com.';
        status.className = 'form-status error';
      });
  });
});
