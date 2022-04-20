import axios from 'axios';import { showAlert } from '../../alerts';

export const changeEnrollmentsYear = (year) => {
  location.assign(`/enrollments_table/${year}`);
};

export const saveEnrollentSelections = async (enrollments) => {
  alert('save enrollment selections')
  alert(enrollments);
  const enrollmentsToAdd = enrollments.filter((e) => {
    return !e._id && e.class;
  });
  const enrollmentsToUpdate = enrollments.filter((e) => {
    return e._id && e.class;
  });
  const enrollmentsToDelete = enrollments.filter((e) => {
    return e._id && !e.class;
  });
  
  alert(enrollmentsToAdd.length);
  enrollmentsToAdd.forEach(async (e) => {
    
    try {
      var url = `/api/v1/enrollments`;
      alert("adding ")
      const res = await axios({
        method: 'POST',
        url,
        data: e,
      });
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });
  
  alert(enrollmentsToUpdate.length)
  enrollmentsToUpdate.forEach(async (e) => {
    try {
      var url = `/api/v1/enrollments/${e._id}`;
      
      const res = await axios({
        method: 'PATCH',
        url,
        data: e,
      });
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });
  
  alert(enrollmentsToDelete.length)
  enrollmentsToDelete.forEach(async (e) => {
    try {
      var url = `/api/v1/enrollments/${e._id}`;

      const res = await axios({
        method: 'DELETE',
        url,
        data: e,
      });
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });

  if (res.data.status == 'success') {
      
      showAlert(
        'success',
        `Enrollment selections saved successfully`
      );
    
      window.setTimeout(() => {
        location.replace(`/enrollment_profile/${familyId}/${selectedYear}`);
      }, 500);
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
