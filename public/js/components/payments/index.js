/* eslint-disable */ // import 'core-js/stable';// import 'regenerator-runtime/runtime';

import { changePaymentsYear } from "./actions";

function index(a) {
  // DOM elements

  const payments = document.querySelector(".payments");

  //const enrollmentProfile = document.querySelector('.enrollment-profile');

  if (payments) {
    alert("setting event listeners for payments");
    const yearSelect = document.getElementById('year-select');
    const parentId = document.querySelector(".payments__title").id;
    //alert (`${yearSelect.value}   ${parentId}`)
    yearSelect.addEventListener('change', (e) => {
      //alert(`${yearSelect.value} is yearselect`)
      const newYear = yearSelect.value;
      changePaymentsYear(newYear, parentId);
    });
  }

  // if (enrollmentProfile) {
  //   const enrollmentProfileForm = document.querySelector(
  //     '.enrollment-profile__form'
  //   );
  //   const saveSelectionsButton = document.querySelector('.btn-save-selections');

  //   saveSelectionsButton.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     const enrollmentSelections = document.getElementsByName('enrollment');
  //     const enrollmentData=[]
  //     enrollmentSelections.forEach((selection) => {
  //       const data = selection.options[selection.selectedIndex].dataset;
  //       enrollmentData.push(
  //         {
  //           _id: data.enrollmentId,
  //           class: data.classId,
  //           child: data.childId
  //         }
  //       )
  //       //alert(Boolean(data.enrollmentId) +" " +  Boolean(data.classId))
  //     });

  //     saveEnrollentSelections(enrollmentData);
  //   });
  //   enrollmentProfileForm.addEventListener('submit', (e) => {
  //     e.preventDefault();

  //     const selectedYear = elementProfile.dataset.selectedYear;
  //     //const isNew = classProfile.dataset.isNew == 'new';

  //     // const classId = classProfileForm.id;
  //     // const course = document.getElementById('course').value;
  //     // const teacher = document.getElementById('teacher').value;
  //     // const sessions = document.getElementById('sessions').value;
  //     // const location = document.getElementById('location').value;
  //     // const semester = document.getElementById('semester').value;
  //     // const time = document.getElementById('time').value;

  //     // const cl = {
  //     //   id: classId,
  //     //   course,
  //     //   teacher,
  //     //   sessions,
  //     //   location,
  //     //   semester,
  //     //   time,
  //     //   year: selectedYear,
  //     //   isNew,
  //     // };
  //     // console.log(cl);

  //   });
  // }
}

export { index };
