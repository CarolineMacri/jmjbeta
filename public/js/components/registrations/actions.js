import axios from 'axios';
import { showAlert } from '../../alerts';

export const changeRegistrationsYear = (year) => {
  location.assign(`/registrations_table/${year}`);
};
export const updateRegistration = async (registeredUser, selectedYear) => {
  const method = 'PATCH';

  try {
    const url = `/api/v1/users/${registeredUser.id}`;
    alert(url);
    //console.log(`updating  ${course.name} name`);
    const res = await axios({
      method,
      url,
      data: registeredUser,
    });

    if (res.data.status == 'success') {
      registeredUser = res.data.data.user;
      showAlert('success', `${registeredUser.lastName}  updated successfully`);
      window.setTimeout(() => {
        location.replace(
          `/registration_profile/${selectedYear}/${registeredUser.id}`
        );
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
