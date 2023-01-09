/* eslint-disable */ // import 'core-js/stable';// import 'regenerator-runtime/runtime';

import {
  changeClassesYear,
  updateClass,
  deleteClassModal,
  changeClassGridYear,
} from './actions';

function index(a) {
  // DOM elements

  const classes = document.querySelector('.classes');
  const classProfile = document.querySelector('.class-profile');
  const classGrid = document.querySelector('.class-grid');

  if (classes) {
    const yearSelect = document.getElementById('year-select');
    yearSelect.addEventListener('change', (e) => {
      const newYear = yearSelect.value;
      changeClassesYear(newYear);
    });

    // add event listners for each course
    const classRows = document
      .querySelector('.classes')
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
      const semesterSessions = {
        1: document.getElementById('semesterSessions1').value,
        2: document.getElementById('semesterSessions2').value,
      };
      const location = document.getElementById('location').value;
      const time = document.getElementById('time').value;

      const cl = {
        id: classId,
        course,
        teacher,
        semesterSessions,
        location,
        time,
        year: selectedYear,
        isNew,
      };
      //console.log(cl);

      updateClass(classId, cl, selectedYear);
    });
  }
  if (classGrid) {
    const yearSelect = document.getElementById('year-select');
    yearSelect.addEventListener('change', (e) => {
      const newYear = yearSelect.value;
      changeClassGridYear(newYear);
    });
  }
}

export { index };
