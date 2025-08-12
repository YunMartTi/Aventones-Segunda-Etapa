document.addEventListener('DOMContentLoaded', () => {
  const userKey = 'loggedInUser';

  const form = document.querySelector('form');

  const userData = JSON.parse(sessionStorage.getItem(userKey)) || {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    country: 'Costa Rica',
    state: '',
    city: '',
    phone: ''
  };

  form.querySelector('input[name="firstName"]').value = userData.fName || '';
  form.querySelector('input[name="lastName"]').value = userData.lName || '';
  form.querySelector('input[name="email"]').value = userData.email || '';
  form.querySelector('input[name="address"]').value = userData.address || '';
  form.querySelector('select[name="country"]').value = userData.country || '-- Select --';
  form.querySelector('input[name="state"]').value = userData.state || '';
  form.querySelector('input[name="city"]').value = userData.city || '';
  form.querySelector('input[name="phone"]').value = userData.number || '';

  form.addEventListener('submit', e => {
    e.preventDefault();

    const updatedUser = {
      firstName: form.querySelector('input[name="firstName"]').value.trim(),
      lastName: form.querySelector('input[name="lastName"]').value.trim(),
      email: form.querySelector('input[name="email"]').value.trim(),
      address: form.querySelector('input[name="address"]').value.trim(),
      country: form.querySelector('select[name="country"]').value,
      state: form.querySelector('input[name="state"]').value.trim(),
      city: form.querySelector('input[name="city"]').value.trim(),
      phone: form.querySelector('input[name="phone"]').value.trim()
    };

    sessionStorage.setItem(userKey, JSON.stringify(updatedUser));

    alert('Profile updated successfully!');
  });
});
