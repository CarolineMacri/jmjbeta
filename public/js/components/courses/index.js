/* eslint-disable */ // import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import { changeCoursesYear, updateCourse, deleteCourseModal } from './actions';

function index(a) {
  // DOM elements
  const courses = document.querySelector('.courses');
  const courseProfile = document.querySelector('.course-profile');

  if (courses) {
    const yearSelect = document.getElementById('year-select');
    yearSelect.addEventListener('change', (e) => {
      const ownerId = document.querySelector('.courses__title').id;
      const newYear = yearSelect.value;
      changeCoursesYear(newYear, ownerId); 
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

      const selectedYear = courseProfile.dataset.selectedYear;
      const isNew = courseProfile.dataset.isNew == 'new';
      const hasOwner = courseProfile.dataset.hasOwner == 'true';
      const courseId = courseProfileForm.id;
      const name = document.getElementById('courseName').value;
      const owner = document.getElementById('owner').value;
      const courseYears = getChecked('years');
      const classFee = document.getElementById('classFee').value;

      // const materialsFee = [
      //   {
      //     semester: 1,
      //     amount: document.getElementById('materialsFeeAmount1').value,
      //   },
      //   {
      //     semester: 2,
      //     amount: document.getElementById('materialsFeeAmount2').value,
      //   },
      // ];
      const semesterMaterialsFee = {
        1: document.getElementById('semesterMaterialsFee1').value,
        2: document.getElementById('semesterMaterialsFee2').value,
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
      const notes = document.getElementById('notes').value;
      const materials = document.getElementById('materials').value;
      const texts = document.getElementById('texts').value;

      const course = {
        id: courseId,
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
