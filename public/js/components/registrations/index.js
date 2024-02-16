/* eslint-disable */ // import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import { changeRegistrationsYear, updateRegistration } from './actions';

export function index(a) {

  console.log('registration components');
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
      const registeredUserId = registrationProfileForm.id;

      var registeredUser = {
        id: registeredUserId,
      };

      var y;
      var yearRoles = {};

      const years = document.getElementsByName('years');
      years.forEach((y) => {
        if (y.checked == true) {
          if (y.dataset.roles == 'none') {
            yearRoles[y.value] = [];
          }
        } else {
          yearRoles[y.value] = null;
        }
      });
      registeredUser.yearRoles = yearRoles;

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

//export { index };
