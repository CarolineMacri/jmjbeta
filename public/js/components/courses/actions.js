import axios from 'axios';
import { showAlert } from '../../alerts';

export const changeCoursesYear = (year) => {
  location.assign(`/courses_table/${year}`);
};

// export const toggleModal = () => {
//   document
//     .querySelector('.form-modal__window')
//     .classList.toggle('form-modal__show');
// };

// export const modalOnClick = (event) => {
//   if ((event.target = document.querySelector('.form-modal__window'))) {
//     toggleModal();
//   }
// };

export const updateCourse = async (courseId, data) => {
  //export const updateCourse = (courseId, data) => {
  try {
    const url = `/api/v1/courses${courseId == 'new' ? '' : '/' + courseId}`;

    const method = courseId == 'new' ? 'POST' : 'PATCH';

    const res = await axios({
      method,
      url,
      data,
    });

    if (res.data.status == 'success') {
      showAlert(
        'success',
        `Course ${courseId == 'new' ? 'added' : 'updated'} successfully`
      );
      window.setTimeout(() => {
        location.reload();
      }, 500);
      
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteCourseModal = async (row) => {
  const courseId = row.id;

  const [courseName, courseGrades, courseFee, x, y] = [...row.children].map(
    (e) => e.innerHTML
  );

  const deleteModal = document.querySelector('.delete-modal__window');

  const paragraphs = deleteModal.getElementsByTagName('p');
  paragraphs.item(2).innerHTML =
    courseName.toUpperCase() + '   ' + courseGrades;

  const deleteCourseButton = document.getElementById('deleteCourse');

  deleteCourseButton.addEventListener('click', function () {
    deleteCourse(courseId, courseName);
  });

  deleteModal.classList.toggle('delete-modal__show');
};

export const deleteCourse = async (courseId, courseName) => {
  //const deleteCourse = (courseId, courseName) => {
  try {
    const url = `/api/v1/courses/${courseId}`;

    const res = await axios({
      method: 'DELETE',
      url,
    });

    if (res.status == 204) {
      showAlert('success', `${courseName} deleted`);
      window.setTimeout(() => {
        location.reload();
      }, 500);

      showAlert('success', `${courseName} successfully deleted`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
