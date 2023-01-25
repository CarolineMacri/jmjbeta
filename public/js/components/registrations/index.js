/* eslint-disable */ // import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import { changeRegistrationsYear, updateRegistration } from './actions';

function index(a) {
  // DOM elements
  const registrations = document.querySelector('.registrations');
  const registrationProfile = document.querySelector('.registration-profile');

  if (registrations) {
    const yearSelect = document.getElementById('year-select');
    yearSelect.addEventListener('change', (e) => {
      const newYear = yearSelect.value;
      changeRegistrationsYear(newYear);
    });
  }

  if (registrationProfile) {
    const registrationProfileForm = document.querySelector(
      '.registration-profile__form'
    );

    registrationProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const selectedYear = registrationProfile.dataset.selectedYear;
      const registrationYears = getChecked('years');
      alert(registrationYears);
      const registeredUserId = registrationProfileForm.id;

      var registeredUser = {
        id: registeredUserId,
      };

      var y;
      var yearRoles = {};

      const years = document.getElementsByName('years');
      alert(years);
      years.forEach((y) => {
        alert(y);
        if (y.checked == true) {
          alert(y.dataset.roles);
          
          if (y.dataset.roles == 'none') {
            yearRoles[y.value] = [];
            alert(`registering for ${y.value}`);
          }
        } else {
          yearRoles[y.value] = null;
        }

      });
      alert(JSON.stringify(yearRoles));
      registeredUser.yearRoles = yearRoles;
      alert(JSON.stringify(registeredUser));

      updateRegistration(registeredUser, selectedYear);
    });
  }
}

function getChecked(name) {
  var items = document.getElementsByName(name);

  var selectedItems = [];

  items.forEach((item) => {
    if (item.type == 'checkbox' && item.checked == true)
      selectedItems.push(item.value);
  });

  return selectedItems;
}

export { index };
