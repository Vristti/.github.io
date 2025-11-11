document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form || !status) return;

  // 1) Initialize EmailJS with your PUBLIC KEY
  emailjs.init('BPvosCZTH0733SKkE');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    status.textContent = 'Sending...';
    status.className = 'form-status sending';

    // 2) Your actual IDs
    const serviceID = 'service_t4eg3fu';
    const templateID = 'template_aosbp1n';

    // 3) Send the form data
    emailjs.sendForm(serviceID, templateID, '#contact-form')
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

