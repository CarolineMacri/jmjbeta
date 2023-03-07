import { emailReport, resetPassword, sendRegistrationVerification } from './actions';
function index(a) {
  //alert(' in test')
  const newPage = document.querySelector('.new_page');

  if (newPage) {
    const emailReportButton = document.getElementById('emailReport');
    const resetPasswordsButton = document.getElementById('resetPasswords');
    const selectAllMembersButton = document.getElementById('selectAllMembers');
    const sendRegistrationVerificationButton = document.getElementById('sendRegistrationVerification');

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
    
    sendRegistrationVerificationButton.addEventListener('click', function () {
      const selectedMembers = document.getElementsByName('member');
      selectedMembers.forEach((el) => {
        if (el.selected){
          sendRegistrationVerification(el.value);   
      }
      });
    })
  }
}

export { index };
