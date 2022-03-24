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

export const updateCourse = async (
  courseId,
  course,
  teachercourseId,
  teachercourse
) => {
  //export const updateCourse = (courseId, data) => {
  const isNewCourse = courseId == 'new';
  const method = isNewCourse == 'new' ? 'POST' : 'PATCH';
  try {
    var url = `/api/v1/courses${isNewCourse ? '' : '/' + courseId}`;

    const res = await axios({
      method,
      url,
      data: course,
    });

    if (res.data.status == 'success') {
      courseId = res.data.data.course.id;
      showAlert(
        'success',
        `Course ${courseId == 'new' ? courseId : 'updated'} successfully`
      );
      // window.setTimeout(() => {
      //   location.replace('/course_profile/' + res.data.data.course._id);
      // }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }

  try {
    
    var url = `/api/v1/teachercourses${
      isNewCourse ? '' : '/' + teachercourseId
    }`;
    teachercourse.course = courseId;

    alert(teachercourse.course);

    const res = await axios({
      method,
      url,
      data: teachercourse,
    });

    if (res.data.status == 'success') {
      teachercourseId = res.data.data.teachercourse.id;
      showAlert(
        'success',
        `Teachercourse ${teachercourseId == 'new' ? 'added' : 'updated'} successfully`
      );
      window.setTimeout(() => {
        location.replace('/course_profile/' + courseId);
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
