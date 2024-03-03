/* eslint-disable */
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import { addFamily, existsFamilyForYear } from '../families/actions';
import { addTeacher, existsTeacher } from '../teachers/actions';

import {
  changeUsersYear,
  fillUserForm,
  updateUser,
  deleteUserModal,
} from './actions';

export function index(a) {
  
  console.log('user components');

  //DOM
  const users = document.querySelector('.users');
  const userProfileForm = document.querySelector('.user-profile__form');

  if (users) {
    const yearSelect = document.getElementById('year-select');

    // alert('adding event listener to year-select');
    yearSelect.addEventListener('change', (e) => {
      const newYear = yearSelect.value;
      //const id = window.location.pathname.split('/')[2];
      alert(newYear);

      changeUsersYear(newYear);
    });

    // add event listners for each child
    const usersRows = document
      .querySelector('.users')
      .getElementsByTagName('tr');

    const numRows = usersRows.length;

    for (var i = 1; i <= numRows - 2; i++) {
      const dataRow = usersRows[i];
      const dataCells = dataRow.getElementsByTagName('td');
      const numCells = dataCells.length;
      const editButton = dataCells.item(numCells - 2);
      const deleteButton = dataCells.item(numCells - 1);

      editButton.addEventListener('click', function () {
        fillUserForm(dataRow);
      });

      deleteButton.addEventListener('click', function () {
        deleteUserModal(dataRow);
      });
    }

    const addNewRow = usersRows[numRows - 1];
    const addNewCells = addNewRow.getElementsByTagName('td');
    const addNewButton = addNewCells.item(0);

    addNewButton.addEventListener('click', function () {
      fillUserForm(addNewRow);
    });

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

    userProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const lN = document.getElementById('lastName');
      const lastName = lN.value;
      const fN = document.getElementById('firstName');
      const firstName = fN.value;
      const em = document.getElementById('email');
      const email = em.value;
      const cf = document.getElementById('cellPhone');
      var cellPhone = cf.value.replace(/-/g, '');
      const id = userProfileForm.id;
      const role = document.getElementsByName('roles');
      const selectedYear = document.getElementById('selectedYear').innerHTML;

      var r;
      var roles = [];
      for (r of role) {
        if (r.checked) {
          roles.push(r.value);
        }
      }

      var yearRoles = {};
      yearRoles[selectedYear] = roles;

      var data = { lastName, firstName, email, cellPhone, yearRoles };

      if (id == 'new') {
        data.registrationYears = [selectedYear];
      }

      updateUser(id, data).then((newId) => {
        // Add family to new user, or family to user who didn't have a family role previously for this year
        if (roles.includes('parent')) {
          if (id == 'new') {
            addFamily(newId, selectedYear);
          } else {
            existsFamilyForYear(id, selectedYear).then((exists) => {
              if (!exists) {
                addFamily(newId, selectedYear);
              }
            });
          }
        }

        // Add teacher to new user, or teacher to user who didn't have a teacher role previously
        if (roles.includes('teacher')) {
          if (id == 'new') {
            addTeacher(newId);
          } else {
            existsTeacher(id).then((exists) => {
              if (!exists) {
                addTeacher(newId);
              }
            });
          }
        }
      });
    });
  }
}