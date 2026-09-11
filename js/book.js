document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('book-form');
  if (!form) return;

  const ageInput = document.getElementById('bf-age');
  const ageValue = document.getElementById('bf-age-value');
  if (ageInput && ageValue) {
    ageInput.addEventListener('input', () => {
      ageValue.textContent = ageInput.value;
    });
  }

  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get('service');
  const contextParam = params.get('context');

  if (serviceParam) {
    const map = {
      quality: 'Guided Intake Session ($100)',
      advanced: 'Full Access Plan ($175)',
      notary: 'Texas Notary Services (add-on)',
      'emergency-packet': 'Emergency Contact Packet',
      'pet-packet': 'Pet Emergency Packet',
    };
    const targetValue = map[serviceParam] || serviceParam;
    form.querySelectorAll('input[name="service"]').forEach((cb) => {
      if (cb.value === targetValue) cb.checked = true;
    });
  }

  if (contextParam) {
    const messageField = document.getElementById('bf-message');
    if (messageField) messageField.value = `Context: ${contextParam}\n\n`;
  }
});
