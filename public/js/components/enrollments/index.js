/* eslint-disable */ // import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import { changeEnrollmentsYear, updateEnrollment} from './actions';

function index(a) {
  // DOM elements

  const enrollments = document.querySelector('.enrollments');

  const enrollmentProfile = document.querySelector('.enrollment_profile');

  if (enrollments) {
    //alert('before year select');
    const yearSelect = document.getElementById('year-select');
    //alert (`${yearSelect.value} is yearselect`)
    yearSelect.addEventListener('change', (e) => {
      const newYear = yearSelect.value;
      changeEnrollmentsYear(newYear);
    });

    // add event listners for each family
    const classRows = document
      .querySelector('.enrollments')
      .getElementsByTagName('tr');

    const numRows = classRows.length;

    for (var i = 1; i <= numRows - 2; i++) {
      const dataRow = classRows[i];
      const dataCells = dataRow.getElementsByTagName('td');
      const numCells = dataCells.length;
      const deleteButton = dataCells.item(numCells - 1);

      deleteButton.addEventListener('click', function () {
        deleteClassModal(dataRow);
      });
    }

    const cancelDelete = document.getElementById('cancelDelete');
    cancelDelete.addEventListener('click', (e) => {
      e.preventDefault();
      document
        .querySelector('.delete-modal__window')
        .classList.toggle('delete-modal__show');
    });
  }

  if (classProfile) {
    const classProfileForm = document.querySelector('.class-profile__form');
    classProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const selectedYear = classProfile.dataset.selectedYear;
      const isNew = classProfile.dataset.isNew == 'new';

      const classId = classProfileForm.id;
      const course = document.getElementById('course').value;
      const teacher = document.getElementById('teacher').value;
      const sessions = document.getElementById('sessions').value;
      const location = document.getElementById('location').value;
      const semester = document.getElementById('semester').value;
      const time = document.getElementById('time').value;

      const cl = {
        id: classId,
        course,
        teacher,
        sessions,
        location,
        semester,
        time,
        year: selectedYear,
        isNew,
      };
      console.log(cl);

      updateClass(classId, cl, selectedYear);
    });
  }
}

export { index };
