import axios from 'axios';
import { showAlert } from '../../alerts';

export const changeTeachersYear = (year) => {
  location.assign(`/teachers_table/${year}`);
};

export const updateTeacher = async (teacherDocument) => {
  try {
    const url = `/api/v1/teachers`;

    const method = 'PATCH';

    const data = { teacher: teacherId };

    const res = await axios({
      method,
      url,
      data,
    });

    if (res.data.status == 'success') {
      showAlert('success', `Teacher added successfully`);
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};


export const addTeacher = async (teacherId) => {
  try {
    const url = `/api/v1/teachers`;

    const method = 'POST';

    const data = { teacher: teacherId };

    const res = await axios({
      method,
      url,
      data,
    });

    if (res.data.status == 'success') {
      showAlert('success', `Teacher added successfully`);
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const existsTeacher = async (teacherId) => {
  try {
    const url = `/api/v1/teachers/?teacher=${teacherId}`;
    const method = 'GET';
    const data = { teacher: teacherId };
    const res = await axios({
      method,
      url,
      data,
    });
    if (res.data.status == 'success') { 
      return res.data.results != 0;
    }
  } catch (err) {
    showAlert('error', err.response.data.message); 
  }
};


