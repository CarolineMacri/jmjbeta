/* eslint-disable */ // import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import {
  changeTeachersYear,
  updateTeacher,
} from './actions';

function index(a) {
  // DOM
  const teachers = document.querySelector('.teachers');
  const teacherProfile = document.querySelector('.teacher-profile');

  if (teachers) {
    const yearSelect = document.getElementById('year-select');

    yearSelect.addEventListener('change', (e) => {
      const newYear = yearSelect.value;

      changeTeachersYear(newYear);
    });
  }

  if (teacherProfile) {
    const teacherProfileForm = document.querySelector('.teacher-profile__form'); 

    teacherProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const teacher = {
        id: teacherProfileForm.id,
        bio: document.getElementById('bio').value,
      };

      updateTeacher(teacher);
    });

    const formCancel = document.querySelector('.form__cancel');
    formCancel.addEventListener('click',(e) => {
      e.preventDefault();
      history.back();

    })
  }
}

export { index };
