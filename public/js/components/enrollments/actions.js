import axios from 'axios';
import { showAlert } from '../../alerts';

export const changeEnrollmentsYear = (year) => {
  location.assign(`/enrollments_table/${year}`);
};

export const submitEnrollments = async (familyId) => {
  try {
    var url = `/api/v1/families/${familyId}`;
    const family = {
      enrollmentStatus: 'preliminary',
    };
    const res = await axios({
      method: 'PATCH',
      url,
      data: family,
    });
    if (res.data.status == 'success') {
      showAlert('success', 'Enrollments submitted successfully');
    }

    const parentId = res.data.data.family.parent.id;
    window.setTimeout(() => {
      // location.replace(`/enrollment_profile/${parentId}`);
      // document.location.reload(true)
      window.location.href = window.location.href;
    }, 500);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const saveEnrollentSelections = async (enrollments) => {
  const enrollmentsToAdd = enrollments.filter((e) => {
    return !e._id && e.class;
  });
  const enrollmentsToUpdate = enrollments.filter((e) => {
    return e._id && e.class;
  });
  const enrollmentsToDelete = enrollments.filter((e) => {
    return e._id && !e.class;
  });

  enrollmentsToAdd.forEach(async (e) => {
    try {
      var url = `/api/v1/enrollments`;

      const res = await axios({
        method: 'POST',
        url,
        data: e,
      });
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });

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

  // if you got to here - everything is good
  showAlert('success', `Enrollment selections saved successfully`);
};
