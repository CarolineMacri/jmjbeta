/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login, logout } from './login';
import { forgotMyPassword } from './forgotMyPassword';
import { updateUserSettings } from './updateUserSettings';
import { resetPassword } from './resetPassword';
import { changeFamilyYear, addFamily } from './family';
import { changeFamiliesYear } from './families';
import { changeRegistrationsYear } from './registrations';

import { index as courses } from './components/courses/index';
courses();

import { changeTeachersYear } from './teachers';
import { changeReportChildrenByGradeYear } from './reports';
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

// DOM elements
const loginForm = document.querySelector('.login__form');
const logoutItem = document.querySelector('.dropdown__item--logout');

const forgotPasswordLink = document.querySelector('.login__forgot-password');
const resetPasswordForm = document.querySelector('.reset-password__form');

const myProfileForm = document.querySelector('.my-profile__form');
const updatePasswordForm = document.querySelector('.update-password__form');

const family = document.querySelector('.family');
const families = document.querySelector('.families');

const momProfileForm = document.querySelector('.mom-profile__form');

const children = document.querySelector('.children');
const childProfileForm = document.querySelector('.child-profile__form');

//const courses = document.querySelector('.courses');
const teachers = document.querySelector('.teachers');
const registrations = document.querySelector('.registrations');

const users = document.querySelector('.users');
const userProfileForm = document.querySelector('.user-profile__form');

const reportChildrenByGrade = document.querySelector('.reportChildrenByGrade');

//values

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await login(email, password);
  });
}

if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    alert(email.toUpperCase());
    await forgotMyPassword(email);
  });
}

if (logoutItem) {
  logoutItem.addEventListener('click', logout);
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.update-password__button').innerHTML =
      'Updating.....';

    const data = {
      password: document.getElementById('password').value,
      newPassword: document.getElementById('newPassword').value,
      newPasswordConfirm: document.getElementById('newPasswordConfirm').value,
    };

    await updateUserSettings('password', data);

    document.getElementById('password').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('newPasswordConfirm').value = '';
    document.querySelector('.update-password__button').innerHTML = 'Submit';
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const newPasswordConfirm =
      document.getElementById('newPasswordConfirm').value;

    const currentUrlParts = window.location.href.split('/');
    const resetPasswordIndex = currentUrlParts.indexOf('resetPassword');
    const token = currentUrlParts[resetPasswordIndex + 1];

    resetPassword(token, newPassword, newPasswordConfirm);

    document.querySelector('.reset-password__button').innerHTML =
      'Resetting.....';
  });
}

if (myProfileForm) {
  myProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const cellPhone = document.getElementById('cellPhone').value;

    const data = {
      firstName,
      lastName,
      email,
      cellphone: cellPhone.replaceAll('-', ''),
    };
    await updateUserSettings('profile', data);
  });
}
if (momProfileForm) {
  momProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const cellPhone = document.getElementById('cellPhone').value;

    const data = {
      firstName,
      lastName,
      email,
      cellphone: cellPhone.replaceAll('-', ''),
    };

    const momId = window.location.pathname.split('/')[2];
    await updateUser(momId, data);
  });
}

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
    console.log(editFamilyButtons);
    editFamilyButtons.forEach((btn) => {
      console.log(btn.id);
      btn.addEventListener('click', () => {
        alert(`${btn.id}`);
      });
    });
  }
}

// if (courses) {
//   const yearSelect = document.getElementById('year-select');

//   yearSelect.addEventListener('change', (e) => {
//     const newYear = yearSelect.value;

//     changeCoursesYear(newYear);
//   });
// }

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
    e.preventDefault();
    const lN = document.getElementById('lastName');
    const lastName = lN.value;
    const fN = document.getElementById('firstName');
    const firstName = fN.value;
    const em = document.getElementById('email');
    const email = em.value;
    const cf = document.getElementById('cellPhone');
    const cellPhone = cf.value;
    const id = userProfileForm.id;
    const role = document.getElementsByName('roles');
    var r;
    var roles = [];
    for (r of role) {
      if (r.checked) {
        roles.push(r.value);
      }
    }

    const data = {
      lastName,
      firstName,
      email,
      cellPhone,
      roles,
    };

    if (id == 'new') {
      data.registrationYears = [yearSelect.value];
    }

    updateUser(id, data).then((newId) => {
      if (id == 'new') {
        alert('new parent id for addFamily: ' + newId);
        addFamily(newId);
      }
    });
  });
}
