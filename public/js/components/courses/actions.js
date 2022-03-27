import axios from 'axios';
import { showAlert } from '../../alerts';

export const changeCoursesYear = (year) => {
  location.assign(`/courses_table/${year}`);
};

export const updateCourse = async (courseId, course) => {
  const isNewCourse = courseId == 'new';
  console.log(course.name);

  const method = isNewCourse ? 'POST' : 'PATCH';
 
  try {
    var url = `/api/v1/courses${isNewCourse ? '' : '/' + courseId}`;

    const res = await axios({
      method,
      url,
      data: course,
    });

    if (res.data.status == 'success') {
      showAlert(
        'success',
      `${course.name} ${courseId == 'new' ? ' added ' : ' updated '} successfully`
      );
      window.setTimeout(() => {
        location.replace('/course_profile/' + res.data.data.course.id);
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
