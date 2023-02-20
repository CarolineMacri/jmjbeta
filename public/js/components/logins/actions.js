import axios from 'axios';
import url from 'url';
import { showAlert } from '../../alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    const id = res.data.data.user._id;
    const currentRoles = res.data.data.user.currentRoles;

    var homeUrl = '/splash';
    
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');  
      window.setTimeout(() => {
        location.assign(homeUrl);
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status == 'success') {
      location.replace('/');
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

export const resetPassword = async (token, newPassword, newPasswordConfirm) => {
  try {
    const url = `/api/v1/users/resetPassword/${token}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data: {
        password: newPassword,
        passwordConfirm: newPasswordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', `Password reset successfully`);
      window.setTimeout(() => {
        location.assign('/login');
      }, 1000);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};

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
        location.assign(type == 'profile' ? '/myProfile' : '/updatePassword');
      }, 1000);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};

export const forgotMyPassword = async (email) => {
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
