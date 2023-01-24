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
      const registeredUserId = registrationProfileForm.id;
      
      const registrationYears = getChecked('years');
      

      const registeredUser = {
        id: registeredUserId,
        name,
        owner,
        years: courseYears,
        classFee,
        grade,
        classSize,
        description,
        notes,
        materials,
        texts,
        semesterMaterialsFee,
        isNew,
      };
      updateCourse(courseId, course, selectedYear, hasOwner);
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
