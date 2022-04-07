import axios from 'axios';
import { showAlert } from './alerts';

// type = profile or password
export const updateUserSettings = async (type, data) => {
  try {
    const url =
      type == 'password'
        ? `/api/v1/users/updateMyPassword`
        : `/api/v1/users/updateMe`; 

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
  

    if (res.data.status === 'success') {
      
      showAlert('success', `${type} updated successfully`);
      window.setTimeout(() => {
        location.assign( (type == 'profile')?'/myProfile':'/updatePassword');
      }, 1000);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};
