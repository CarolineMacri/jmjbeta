import axios from 'axios';import { showAlert } from '../../alerts';

export const changeClassesYear = (year) => {
  location.assign(`/classes_table/${year}`);
};

export const updateClass = async (classId, cl, selectedYear) => {
  const isNewClass = cl.isNew == true;

  const method = isNewClass ? 'POST' : 'PATCH';

  try {
    var url = `/api/v1/classes${isNewClass ? '' : '/' + classId}`;

    const res = await axios({
      method,
      url,
      data: cl,
    });

    if (res.data.status == 'success') {
      const cl = res.data.data.class;
      showAlert(
        'success',
        `${cl.location} - ${cl.hour} class ${
          classId == 'new' ? ' added ' : ' updated '
        } successfully`
      );
      cl = res.data.data.class;
      window.setTimeout(() => {
        location.replace(`/class_profile/${cl.id}/${selectedYear}`);
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteClassModal = async (row) => {
  const classId = row.id;

  const [className, classTime, classLocation, classGrades, x, y] = [
    ...row.children,
  ].map((e) => e.innerHTML);
  alert('indeleteclassmodal');

  const deleteModal = document.querySelector('.delete-modal__window');

  const paragraphs = deleteModal.getElementsByTagName('p');
  paragraphs.item(2).innerHTML =
    className.toUpperCase() + '   ' + classTime + ' ' + classLocation;

  const deleteCourseButton = document.getElementById('deleteClass');
  const classMsg = `<p>${className}</p> <p>in ${classLocation}</p> <p>at ${classTime}</p>`

  deleteCourseButton.addEventListener('click', function () {
    deleteClass(classId, classMsg);
  });

  deleteModal.classList.toggle('delete-modal__show');
};


export const deleteClass = async (classId, className) => {
  try {
    const url = `/api/v1/classes/${classId}`;

    const res = await axios({
      method: 'DELETE',
      url,
    });

    if (res.status == 204) {
      showAlert('success', `${className} unscheduled`);
      window.setTimeout(() => {
        location.reload();
      }, 1000);

      showAlert('success', `${className} successfully unscheduled`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
