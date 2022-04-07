import { login, logout, forgotMyPassword, resetPassword, updateUserSettings } from './actions';

function index(a) {
  const loginForm = document.querySelector('.login__form');
  const logoutItem = document.querySelector('.dropdown__item--logout');

  const forgotPasswordLink = document.querySelector('.login__forgot-password');
  const resetPasswordForm = document.querySelector('.reset-password__form');

  const myProfileForm = document.querySelector('.my-profile__form');
  const updatePasswordForm = document.querySelector('.update-password__form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      await login(email, password);
    });
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      alert(email.toUpperCase());
      await forgotMyPassword(email);
    });
  }

  if (logoutItem) {
    logoutItem.addEventListener('click', logout);
  }

  if (updatePasswordForm) {
    updatePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      document.querySelector('.update-password__button').innerHTML =
        'Updating.....';

      const data = {
        password: document.getElementById('password').value,
        newPassword: document.getElementById('newPassword').value,
        newPasswordConfirm: document.getElementById('newPasswordConfirm').value,
      };

      await updateUserSettings('password', data);

      document.getElementById('password').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('newPasswordConfirm').value = '';
      document.querySelector('.update-password__button').innerHTML = 'Submit';
    });
  }

  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newPassword = document.getElementById('newPassword').value;
      const newPasswordConfirm =
        document.getElementById('newPasswordConfirm').value;

      const currentUrlParts = window.location.href.split('/');
      const resetPasswordIndex = currentUrlParts.indexOf('resetPassword');
      const token = currentUrlParts[resetPasswordIndex + 1];

      resetPassword(token, newPassword, newPasswordConfirm);

      document.querySelector('.reset-password__button').innerHTML =
        'Resetting.....';
    });
  }

  if (myProfileForm) {
    myProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('email').value;
      const cellPhone = document.getElementById('cellPhone').value;

      const data = {
        firstName,
        lastName,
        email,
        cellPhone: cellPhone.replaceAll('-', ''),
      };
      await updateUserSettings('profile', data);
    });
  }
}

export { index };
