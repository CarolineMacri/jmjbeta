/* eslint-disable */ // import 'core-js/stable';// import 'regenerator-runtime/runtime';

import { changeCoursesYear, updateCourse, deleteCourseModal } from './actions';

export function index(a) {
  
  console.log('course components');
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
    //alert(' in course Profile');
    const courseProfileForm = document.querySelector('.course-profile__form');
    //if (courseProfileForm) alert('courseProfile form OK');

    courseProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      //alert('submitted');

      const selectedYear = courseProfile.dataset.selectedYear;
      const isNew = courseProfile.dataset.isNew == 'new';
      const hasOwner = courseProfile.dataset.hasOwner == 'true';
      const courseId = courseProfileForm.id;
      const name = document.getElementById('courseName').value;

      const semesterMaterialsFee = {
        1: document.getElementById('semesterMaterialsFee1').value,
        2: document.getElementById('semesterMaterialsFee2').value,
      };
      
      const description = document.getElementById('description').value;
      const notes = document.getElementById('notes').value;
      const materials = document.getElementById('materials').value;
      const texts = document.getElementById('texts').value;

      const course = {
        id: courseId,
        name,        
        description,
        notes,
        materials,
        texts,
        semesterMaterialsFee,
        isNew,
      };

      const owner = document.getElementById('owner');
      if (owner) {
        course.owner=owner.value
      }

      const courseYears = getChecked('years');
      if (courseYears.length) {
        course.years = courseYears;
      }

      const classFee = document.getElementById('classFee')
      if (classFee) {
        course.classFee = classFee.value
      }

      const gradeMin = document.getElementById('gradeMin')
      if (gradeMin) {
        course.grade = {
          min: document.getElementById('gradeMin').value,
          max: document.getElementById('gradeMax').value,
        };
      }
      const classSizeMin = document.getElementById('classSizeMin')
      if (classSizeMin) {
        course.classSize = {
          min: document.getElementById('classSizeMin').value,
          max: document.getElementById('classSizeMax').value,
        };
      } 
      
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
