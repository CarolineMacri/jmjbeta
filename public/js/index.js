/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { changeFamilyYear, addFamily } from './family';
import { changeFamiliesYear } from './families';
import { changeRegistrationsYear } from './registrations';

import { index as courses } from './components/courses/index';
courses();
import { index as logins } from './components/logins/index';
logins();
import { index as sessions } from './components/classes/index';
sessions();
import { index as enrollments } from './components/enrollments/index';
enrollments();
import { index as payments } from './components/payments/index';
payments();

import { changeTeachersYear } from './teachers';
import { changeReportChildrenByGradeYear } from './reports';
import { changeReportInvoicesYear } from './reports';
import {
  changeChildrenYear,
  fillChildForm,
  updateChild,
  deleteChildModal,
} from './children';
import {
  changeUsersYear,
  fillUserForm,
  updateUser,
  deleteUserModal,
} from './users';
import { ObjectId } from 'mongodb';
//import { fill } from 'core-js/core/array';

const family = document.querySelector('.family');
const families = document.querySelector('.families');

const children = document.querySelector('.children');
const childProfileForm = document.querySelector('.child-profile__form');

const teachers = document.querySelector('.teachers');
const registrations = document.querySelector('.registrations');

const users = document.querySelector('.users');
const userProfileForm = document.querySelector('.user-profile__form');

const reportChildrenByGrade = document.querySelector('.reportChildrenByGrade');
const reportInvoices = document.querySelector('.report-invoices');   

//values

if (family) {
  const yearSelect = document.getElementById('year-select');

  yearSelect.addEventListener('change', (e) => {
    const newYear = yearSelect.value;
    const id = window.location.pathname.split('/')[2];

    changeFamilyYear(id, newYear);
  });
}

if (families) {
  const yearSelect = document.getElementById('year-select');
  const editFamilyButtons = Array.from(
    document.getElementsByClassName('edit-family')
  );

  yearSelect.addEventListener('change', (e) => {
    const newYear = yearSelect.value;

    changeFamiliesYear(newYear);
  });

  if (editFamilyButtons) {
    //console.log(editFamilyButtons);
    editFamilyButtons.forEach((btn) => {
      //console.log(btn.id);
      btn.addEventListener('click', () => {
        alert(`${btn.id}`);
      });
    });
  }
}

if (teachers) {
  const yearSelect = document.getElementById('year-select');

  yearSelect.addEventListener('change', (e) => {
    const newYear = yearSelect.value;

    changeTeachersYear(newYear);
  });
}

if (registrations) {
  const yearSelect = document.getElementById('year-select');

  yearSelect.addEventListener('change', (e) => {
    const newYear = yearSelect.value;

    changeRegistrationsYear(newYear);
  });
}

if (reportChildrenByGrade) {
  const yearSelect = document.getElementById('year-select');

  yearSelect.addEventListener('change', (e) => {
    const newYear = yearSelect.value; 

    changeReportChildrenByGradeYear(newYear);
  });
}
if (reportInvoices) {
  const yearSelect = document.getElementById('year-select');

  yearSelect.addEventListener('change', (e) => {
    const newYear = yearSelect.value;

    changeReportInvoicesYear(newYear);
  });
}

if (children) {
  // year  selector
  const yearSelect = document.getElementById('year-select');

  yearSelect.addEventListener('change', (e) => {
    const newYear = yearSelect.value;
    const id = window.location.pathname.split('/')[2];

    changeChildrenYear(id, newYear);
  });

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
      deleteChildModal(dataRow);
    });
  }

  const addNewRow = childrenRows[numRows - 1];
  const addNewCells = addNewRow.getElementsByTagName('td');
  const addNewButton = addNewCells.item(0);

  addNewButton.addEventListener('click', function () {
    fillChildForm(addNewRow);
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

  childProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fN = document.getElementById('firstName');
    const firstName = fN.value;
    const id = childProfileForm.id;
    const grades = document.getElementsByName('grade');
    var g;
    var grade = '';
    for (g of grades) {
      if (g.checked) {
        grade = g.value;

        break;
      }
    }
    const sexes = document.getElementsByName('sex');
    var s;
    var sex = '';
    for (s of sexes) {
      if (s.checked) {
        sex = s.value;
        break;
      }
    }
    const family = document.querySelector('.family__title').id;

    const year = yearSelect.value;

    const data = {
      firstName,
      grade,
      sex,
      family,
      year,
    };

    updateChild(id, data);
  });
}

if (users) {
  // year  selector
  const yearSelect = document.getElementById('year-select');

  yearSelect.addEventListener('change', (e) => {
    const newYear = yearSelect.value;
    const id = window.location.pathname.split('/')[2];

    changeUsersYear(newYear);
  });

  // add event listners for each child
  const usersRows = document.querySelector('.users').getElementsByTagName('tr');

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
    //alert('adding event listener to userprofile form');
    e.preventDefault();
    const lN = document.getElementById('lastName');
    const lastName = lN.value;
    //alert(lastName);
    const fN = document.getElementById('firstName');
    const firstName = fN.value;
    //alert(firstName);
    const em = document.getElementById('email');
    const email = em.value;
    //alert(email);
    const cf = document.getElementById('cellPhone');
    var cellPhone = cf.value.replace(/-/g, '');
    //alert(cellPhone);
    const id = userProfileForm.id;
    //alert(id);
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

    var data = {
      lastName,
      firstName,
      email,
      cellPhone,
      yearRoles,
    };
    if (id == 'new') {
      data.registrationYears = [selectedYear];
    }

    updateUser(id, data).then((newId) => {
      if (id == 'new') {
        alert('new parent id for addFamily: ' + newId);
        addFamily(newId);
      }
    });
  });
}
