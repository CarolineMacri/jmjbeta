import axios from 'axios';
import { showAlert } from './alerts';

// type = profile or password
export const resetPassword = async (token, newPassword, newPasswordConfirm) => {
  try {
    const url = `/api/v1/users/resetPassword/${token}`;
    alert(`In reset password ${url}`);

    const res = await axios({
      method: 'PATCH',
      url,
      data: {
        password: newPassword,
        passwordConfirm: newPasswordConfirm
      }
    });
  

    if (res.data.status === 'success') {
      showAlert('success', `Password reset successfully`);
        window.setTimeout(() => {
         location.assign('login/login');
       }, 1000);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};
