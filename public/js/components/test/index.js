import {  emailReport,
  resetPassword,
  emailRegistrationVerification,
} from './actions';

export function index(a) {

  console.log('test components');
  
  const newPage = document.querySelector('.new_page');

  if (newPage) {
    const emailReportButton = document.getElementById('emailReport');
    const resetPasswordsButton = document.getElementById('resetPasswords');
    const selectAllMembersButton = document.getElementById('selectAllMembers');
    const emailRegistrationVerificationButton = document.getElementById(
      'emailRegistrationVerification'
    );

    const userId = emailReportButton.dataset.userId;

    emailReportButton.addEventListener('click', function () {
      emailReport(userId);
    });

    resetPasswordsButton.addEventListener('click', function () {
      const selectedMembers = document.getElementsByName('member');
      selectedMembers.forEach((el) => {
        if (el.selected)
          if (
            confirm(
              `Are you sure you want reset password for${el.innerHTML.toUpperCase()}?`
            )
          ) {
            resetPassword(el.value);
          }
      });
    });

    selectAllMembersButton.addEventListener('click', function () {
      const selectedMembers = document.getElementsByName('member');

      selectedMembers.forEach((el) => {
        el.selected = true;
      });
    });

    emailRegistrationVerificationButton.addEventListener('click', function () {
      const selectedMembers = document.getElementsByName('member');
      selectedMembers.forEach((el) => {
        if (el.selected)
          if (
            confirm(
              `Are you want to send registration verification email for ${el.innerHTML.toUpperCase()}?`
            )
          ) {
            emailRegistrationVerification(el.value);
          }
      });
    });
  }
}