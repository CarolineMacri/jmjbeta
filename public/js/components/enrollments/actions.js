import axios from 'axios';
import { showAlert } from '../../alerts';

export const changeEnrollmentsYear = (year) => {
  location.assign(`/enrollments_table/${year}`);
};

export const updateEnrollment = async ( enrollment, familyId, selectedYear) => {
  const isNewEnrollment = enrollment.isNew == true;

  const method = isNewEnrollment ? 'POST' : 'PATCH';

  try {
    var url = `/api/v1/enrollments${isNewEnrollment ? '' : '/' + enrollment.id}`;

    const res = await axios({
      method,
      url,
      data: enrollment,
    });

    if (res.data.status == 'success') {
      const enrollment = res.data.data.enrollment;
      showAlert(
        'success',
        `Enrollment ${
          classId == 'new' ? ' added ' : ' updated '
        } successfully`
      );
      enrollment = res.data.data.enrollment;
      window.setTimeout(() => {
        location.replace(`/enrollment_profile/${familyId}/${selectedYear}`);
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// export const deleteClassModal = async (row) => {
//   const classId = row.id;

//   const [className, classTime, classLocation, classGrades, x, y] = [
//     ...row.children,
//   ].map((e) => e.innerHTML);
//   alert('indeleteclassmodal');

//   const deleteModal = document.querySelector('.delete-modal__window');

//   const paragraphs = deleteModal.getElementsByTagName('p');
//   paragraphs.item(2).innerHTML =
//     className.toUpperCase() + '   ' + classTime + ' ' + classLocation;

//   const deleteCourseButton = document.getElementById('deleteClass');
//   const classMsg = `<p>${className}</p> <p>in ${classLocation}</p> <p>at ${classTime}</p>`

//   deleteCourseButton.addEventListener('click', function () {
//     deleteClass(classId, classMsg);
//   });

//   deleteModal.classList.toggle('delete-modal__show');
// };


// export const deleteClass = async (classId, className) => {
//   try {
//     const url = `/api/v1/classes/${classId}`;

//     const res = await axios({
//       method: 'DELETE',
//       url,
//     });

//     if (res.status == 204) {
//       showAlert('success', `${className} unscheduled`);
//       window.setTimeout(() => {
//         location.reload();
//       }, 1000);

//       showAlert('success', `${className} successfully unscheduled`);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };
