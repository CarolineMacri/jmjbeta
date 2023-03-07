import axios from 'axios';
import { showAlert } from '../../alerts';

export const emailRegistrationVerification = async (selectedMemberId) => {
  const url = `api/v1/users/emailRegistrationVerification/${selectedMemberId}`;
  showAlert(url) 
  const method = 'POST';
  try {
    const res = await axios({
      method,
      url,
    });

    if (res.data.status == 'success') {
      showAlert('success', 'report emailed successfully');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (selectedMemberId) => {
  const url = `api/v1/users/adminResetPassword/${selectedMemberId}`;
  const method = 'PATCH';
  try {
    const res = await axios({
      method,
      url,
    });

    if (res.data.status == 'success') {
      showAlert(
        'success',
        `Password successfully randomized ${res.data.data.user.lastName}`
      );
    }

    //}
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
