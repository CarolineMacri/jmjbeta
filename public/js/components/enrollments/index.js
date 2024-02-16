/* eslint-disable */ // import 'core-js/stable';// import 'regenerator-runtime/runtime';
import { showAlert } from '../../alerts';
import {
  changeEnrollmentsYear,
  saveEnrollentSelections,
  submitEnrollments,
  updateEnrollmentAdmin
} from './actions';

export function index(a) {
  console.log('enrollment components');

  // DOM elements
  const enrollments = document.querySelector('.enrollments');
  const enrollmentProfile = document.querySelector('.enrollment-profile');
  const enrollmentAdminProfile = document.querySelector(
    '.enrollment-admin-profile'
  );

  if (enrollments) {
    const yearSelect = document.getElementById('year-select');

    yearSelect.addEventListener('change', (e) => {
      const newYear = yearSelect.value;
      changeEnrollmentsYear(newYear);
    });
  }

  if (enrollmentProfile) {
    const enrollmentProfileForm = document.querySelector(
      '.enrollment-profile__form'
    );
    const saveSelectionsButton = document.querySelector('.btn-save-selections');
    const enrollmentSelections = document.getElementsByName('enrollment');

    enrollmentProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const unsavedChanges =
        document.getElementById('unsaved-changes').style.visibility ==
        'visible';

      if (unsavedChanges) {
        showAlert('error', 'You have unsaved changes');
      } else {
        const ok = confirm(
          'Are you sure you want to submit your enrollments?\n' +
          'You will no long be able to change your selections\n'
        );
        if (ok) {
          alert(
            'Submitting\n ' +
            'Your enrollment status is PENDING until payments are received'  
          );

          submitEnrollments(enrollmentProfile.id);
        }
      }
    });

    saveSelectionsButton.addEventListener('click', (e) => {
      e.preventDefault();
      const enrollmentSelections = document.getElementsByName('enrollment');
      const enrollmentData = [];
      enrollmentSelections.forEach((selection) => {
        const data = selection.options[selection.selectedIndex].dataset;
        enrollmentData.push({
          _id: data.enrollmentId,
          class: data.classId,
          child: data.childId,
        });
      });

      saveEnrollentSelections(enrollmentData);
      const unsavedChanges = document.getElementById('unsaved-changes');
      unsavedChanges.style.visibility = 'hidden';
      //need to update to show if classes are full
      window.setTimeout(() => {
        location.reload();
      }, 500);
    });

    for (selection of enrollmentSelections) {
      var selection;
      selection.addEventListener('change', (e) => {
        e.preventDefault();

        const unsavedChanges = document.getElementById('unsaved-changes');
        unsavedChanges.style.visibility = 'visible';
      });
    }

    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      // this doesn't seem to work that well
      if (
        document.getElementById('unsaved-changes').style.visibility ===
        'visible'
      ) {
        window.setTimeout(() => {
          location.reload();
        }, 500);
        showAlert('error', 'You have unsaved changes');
      }
      return 'you are about to leave this page'; 
    });
  }

  if (enrollmentAdminProfile) {
    const enrollmentAdminProfileForm = document.querySelector(
      '.enrollment-admin-profile__form'
    );

    enrollmentAdminProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const enrollmentId = enrollmentAdminProfileForm.id;   
      alert(enrollmentId)
      var enrollment = {};
      if (enrollmentId == 'new') {
        enrollment.class = document.getElementById('class').value;
        enrollment.child = document.getElementById('child').value;
      } 
        
      enrollment.drop = {
        status: document.getElementById('dropStatus').checked,
        date: document.getElementById('dropDate').value,
        reason: document.getElementById('dropReason').value
      }
      enrollment.add = {
        status: document.getElementById('addStatus').checked,
        date: document.getElementById('addDate').value,
        reason: document.getElementById('addReason').value
      }
      enrollment.isNew = enrollmentId == 'new'
      
      //alert('temporarily disabled until DROPPED classes are properly handled.');
     
      updateEnrollmentAdmin(enrollment, enrollmentId)
    });
  
  }
}

//export { index };
