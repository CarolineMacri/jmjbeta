/* eslint-disable */ // import 'core-js/stable';// import 'regenerator-runtime/runtime';
import { changeChildrenYear, updateChild, deleteChildModal } from './actions';

export function index(a) {

  console.log('children component');
  
  //DOM elements
  const children = document.querySelector('.children');
  const childProfile = document.querySelector('.child-profile');

  if (children) {
    
    // year  selector
    const yearSelect = document.getElementById('year-select');
    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        const newYear = yearSelect.value;
        const id = window.location.pathname.split('/')[2];

        changeChildrenYear(id, newYear);
      });
    }
    // add event listners for each child
    const childrenRows = document
      .querySelector('.children')
      .getElementsByTagName('tr');

    const numRows = childrenRows.length;

    for (var i = 1; i <= numRows - 2; i++) {
      const dataRow = childrenRows[i];
      const dataCells = dataRow.getElementsByTagName('td');
      const numCells = dataCells.length;
      const editButton = dataCells.item(numCells - 2);
      const deleteButton = dataCells.item(numCells - 1);

      editButton.addEventListener('click', function () {
        fillChildForm(dataRow);
      });

      deleteButton.addEventListener('click', function () {
        if (yearSelect) {
          deleteChildModal(dataRow);
        } else {
          alert('you do not have permission to delete this Child');
        }
      });
    }

    const addNewRow = childrenRows[numRows - 1];
    const addNewCells = addNewRow.getElementsByTagName('td');
    const addNewButton = addNewCells.item(0);

    const cancel = document.getElementById('cancel');
    cancel.addEventListener('click', (e) => {
      e.preventDefault();
      document
        .querySelector('.form-modal__window')
        .classList.toggle('form-modal__show');
    });

    const cancelDelete = document.getElementById('cancelDelete');

    cancelDelete.addEventListener('click', (e) => {
      e.preventDefault();
      document
        .querySelector('.delete-modal__window')
        .classList.toggle('delete-modal__show');
    });
  }

  if (childProfile) {
    const childProfileForm = document.querySelector('.child-profile__form');

    childProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNew = childProfile.dataset.isNew == 'new';
      const childId = childProfileForm.id;
      const fN = document.getElementById('firstName');
      const firstName = fN.value;

      // there will only be a radio box if grade level is editable
      const grades = document.getElementsByName('grade');

      if (grades) {
        var g;
        var grade = '';
        for (g of grades) {
          if (g.checked) {
            grade = g.value;
            break;
          }
        }
      }

      const sexes = document.getElementsByName('sex');
      var s;
      var sex;
      for (s of sexes) {
        if (s.checked) {
          sex = s.value;
          break;
        }
      }

      const family = childProfileForm.dataset.familyId;
      const year = childProfileForm.dataset.selectedYear;

      const child = {
        firstName,
        sex,
      };
      if (grades.length) {
        child.grade = grade;
      }
      if (isNew) {
        child.family = family;
        child.isNew = isNew;
        child.year = year;
      }

      updateChild(childId, child);
    });
  }
}

//export { index };
