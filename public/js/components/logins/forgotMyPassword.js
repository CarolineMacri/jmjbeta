import axios from 'axios';
import url from 'url';
import { showAlert } from './alerts';

export const forgotMyPassword = async (email) => {
  alert(email);
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email, 
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password reset email sent');
      // window.setTimeout(() => {
      //   location.assign('/login');
      // }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
