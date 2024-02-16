/* eslint-disable */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { ObjectId } from 'mongodb';

import { index as children } from './components/children/index';
children();

import { index as courses } from './components/courses/index';
courses();

import { index as enrollments } from './components/enrollments/index';
enrollments();

import { index as families } from './components/families/index';
families();

import { index as logins } from './components/logins/index';
logins();

import { index as payments } from './components/payments/index';
payments();

import { index as registrations } from './components/registrations/index';
registrations();

import { index as sessions } from './components/classes/index';
sessions();

import { index as teachers } from './components/teachers/index';
teachers();

import { index as test } from './components/test/index';
test();

import { index as users } from './components/users/index';
users();

import { index as years } from './components/years/index';  
years();

//import { addFamily, existsFamilyForYear } from './components/families/actions';
//import { addTeacher, existsTeacher } from './components/teachers/actions';
import { changeReportChildrenYear } from './reports';
import { changeReportInvoicesYear } from './reports';
import { changeReportClassListsYear } from './reports';
import { changeReportPaymentsYear } from './reports';
import { changeReportCoursesYear } from './reports'; 
 
// import {
//   changeUsersYear,
//   fillUserForm,
//   updateUser,
//   deleteUserModal,
// } from './users';

// const users = document.querySelector('.users');
// const userProfileForm = document.querySelector('.user-profile__form');

const reportChildren = document.querySelector('.report-children');
const reportInvoices = document.querySelector('.report-invoices');
const reportPayments = document.querySelector('.report-payments');
const reportClassLists = document.querySelector('.report-class-lists');
const reportCourses = document.querySelector('.report-courses');

if (reportChildren) {
  const yearSelect = document.getElementById('year-select');
  yearSelect.addEventListener('change', (e) => {
    const newYear = yearSelect.value;

    changeReportChildrenYear(newYear);
  });
}

if (reportInvoices) {
  const yearSelect = document.getElementById('year-select');
  const parentId = document.querySelector('.invoices-title').id;
  yearSelect.addEventListener('change', (e) => {
    const newYear = yearSelect.value;
    changeReportInvoicesYear(newYear, parentId);
  });
}

if (reportPayments) {
  const yearSelect = document.getElementById('year-select');
  const teacherId = document.querySelector('.payments-title').id;
  yearSelect.addEventListener('change', (e) => {
    const newYear = yearSelect.value;
    changeReportPaymentsYear(newYear, teacherId);
  });
}

if (reportClassLists) {
  const yearSelect = document.getElementById('year-select');
  const teacherId = document.querySelector('.class-lists-title').id;
  yearSelect.addEventListener('change', (e) => {
    const newYear = yearSelect.value;
    changeReportClassListsYear(newYear, teacherId);
  });
}

if (reportCourses) {
  const yearSelect = document.getElementById('year-select');

  yearSelect.addEventListener('change', (e) => {
    const newYear = yearSelect.value;
    changeReportCoursesYear(newYear);
  });
} 

// if (users) {
//   const yearSelect = document.getElementById('year-select');

//   yearSelect.addEventListener('change', (e) => {
//     const newYear = yearSelect.value;
//     const id = window.location.pathname.split('/')[2];

//     changeUsersYear(newYear);
//   });

//   // add event listners for each child
//   const usersRows = document.querySelector('.users').getElementsByTagName('tr');

//   const numRows = usersRows.length;

//   for (var i = 1; i <= numRows - 2; i++) {
//     const dataRow = usersRows[i];
//     const dataCells = dataRow.getElementsByTagName('td');
//     const numCells = dataCells.length;
//     const editButton = dataCells.item(numCells - 2);
//     const deleteButton = dataCells.item(numCells - 1);

//     editButton.addEventListener('click', function () {
//       fillUserForm(dataRow);
//     });

//     deleteButton.addEventListener('click', function () {
//       deleteUserModal(dataRow);
//     });
//   }

//   const addNewRow = usersRows[numRows - 1];
//   const addNewCells = addNewRow.getElementsByTagName('td');
//   const addNewButton = addNewCells.item(0);

//   addNewButton.addEventListener('click', function () {
//     fillUserForm(addNewRow);
//   });

//   const cancel = document.getElementById('cancel');
//   cancel.addEventListener('click', (e) => {
//     e.preventDefault();
    
//     document
//       .querySelector('.form-modal__window')
//       .classList.toggle('form-modal__show');
//   });

//   const cancelDelete = document.getElementById('cancelDelete');

//   cancelDelete.addEventListener('click', (e) => {
//     e.preventDefault();
//     document
//       .querySelector('.delete-modal__window')
//       .classList.toggle('delete-modal__show');
//   });

//   userProfileForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const lN = document.getElementById('lastName');
//     const lastName = lN.value;
//     const fN = document.getElementById('firstName'); 
//     const firstName = fN.value;
//     const em = document.getElementById('email');
//     const email = em.value;
//     const cf = document.getElementById('cellPhone');
//     var cellPhone = cf.value.replace(/-/g, '');
//     const id = userProfileForm.id;
//     const role = document.getElementsByName('roles');
//     const selectedYear = document.getElementById('selectedYear').innerHTML;

//     var r;
//     var roles = [];
//     for (r of role) {
//       if (r.checked) {
//         roles.push(r.value);
//       }
//     }

//     var yearRoles = {};
//     yearRoles[selectedYear] = roles;

//     var data = { lastName, firstName, email, cellPhone, yearRoles };

//     if (id == 'new') {
//       data.registrationYears = [selectedYear];
//     }

//     updateUser(id, data).then((newId) => {
//       // Add family to new user, or family to user who didn't have a family role previously for this year
//       if (roles.includes('parent')) {
//         if (id == 'new') {
//           addFamily(newId, selectedYear);
//         } else {
//           existsFamilyForYear(id, selectedYear).then((exists) => {
//             if (!exists) {
//               addFamily(newId, selectedYear);
//             }
//           });
//         }
//       }

//       // Add teacher to new user, or teacher to user who didn't have a teacher role previously
//       if (roles.includes('teacher')) {
//         if (id == 'new') {
//           addTeacher(newId);
//         } else {
//           existsTeacher(id).then((exists) => {
//             if (!exists) {
//               addTeacher(newId);
//             }
//           });
//         }
//       }
//     });
//   });
// }
