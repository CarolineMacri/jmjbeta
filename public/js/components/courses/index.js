/* eslint-disable */
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import { changeCoursesYear, updateCourse, deleteCourseModal } from './actions';

function index(a) {
  // DOM elements
  const courses = document.querySelector('.courses');
  const courseProfile = document.querySelector('.course-profile');

  if (courses) {
    const yearSelect = document.getElementById('year-select');

    yearSelect.addEventListener('change', (e) => {
      const newYear = yearSelect.value;

      changeCoursesYear(newYear);
    });

    // add event listners for each course
    const coursesRows = document
      .querySelector('.courses')
      .getElementsByTagName('tr');

    const numRows = coursesRows.length;

    for (var i = 1; i <= numRows - 2; i++) {
      const dataRow = coursesRows[i];
      const dataCells = dataRow.getElementsByTagName('td');
      const numCells = dataCells.length;
      const deleteButton = dataCells.item(numCells - 1);

      deleteButton.addEventListener('click', function () {
        deleteCourseModal(dataRow);
      });
    }

    const addNewRow = coursesRows[numRows - 1];
    const addNewCells = addNewRow.getElementsByTagName('td');
    const addNewButton = addNewCells.item(0);

    addNewButton.addEventListener('click', function () {
      fillCoursesForm(addNewRow);
    });

    const cancelDelete = document.getElementById('cancelDelete');

    cancelDelete.addEventListener('click', (e) => {
      e.preventDefault();
      document
        .querySelector('.delete-modal__window')
        .classList.toggle('delete-modal__show');
    });
  }

  if (courseProfile) {
    const courseProfileForm = document.querySelector('.course-profile__form');
    courseProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fN = document.getElementById('courseName');
      const name = fN.value; 
      const id = courseProfileForm.id;
      const classFee = document.getElementsByName('classFee').value;
      const formData = new FormData(courseProfileForm);
      for (var pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const data = {
        name,
        classFee,
      };

      updateCourse(id, data);
    });
  }
}

export { index };
