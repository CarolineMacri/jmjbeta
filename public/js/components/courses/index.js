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

      const id = courseProfileForm.id;
      const name = document.getElementById('courseName').value;
      const classFee = document.getElementById('classFee').value;
      const firstSemester = {
        materialFee: document.getElementById('firstSemesterMaterialFee')
          .value,
      };
      const secondSemester = {
        materialFee: document.getElementById('secondSemesterMaterialFee').value,
      };
      const grade = {
        min: document.getElementById('gradeMin').value,
        max: document.getElementById('gradeMax').value,
      };
      const classSize = {
        min: document.getElementById('classSizeMin').value,
        max: document.getElementById('classSizeMax').value,
      };
      const description = document.getElementById('description').value;
      const materials = document.getElementById('texts').value;
      const texts = document.getElementById('texts').value;

      const data = {
        name,
        classFee,
        firstSemester,
        secondSemester,
        grade,
        classSize,
        description,
        materials,
        texts
      };
      updateCourse(id, data);
    });
  }
}
function createObject(k, v) {
  let obj = {};

  let putInto = obj;
  let tokens = k.split('.');
  for (let i = 0; i < tokens.length; i++) {
    let name = tokens[i];
    let value = i === tokens.length - 1 ? v : {};
    putInto[name] = putInto[name] || value;
    putInto = putInto[name];
  }

  return obj;
}

export { index };
