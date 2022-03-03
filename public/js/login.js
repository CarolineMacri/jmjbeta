import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    console.log('in login');
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login', 
      data: {
        email,
        password,
      },
    });
    const id = res.data.data.user._id;
   //ODO : pick default page based on  admin views)
    const familyUrl = `/family/${id}`;

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully'); 
      window.setTimeout(() => {
        location.assign(familyUrl);
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