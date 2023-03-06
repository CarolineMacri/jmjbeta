import { emailReport, resetPasswords, selectAllMembers } from './actions';

function index(a) {
  //alert(' in test')
  const newPage = document.querySelector(".new_page");

  if (newPage) {
    
   
    const emailReportButton = document.getElementById('emailReport');
    const resetPasswordsButton = document.getElementById('resetPasswords');
    const selectAllMembersButton = document.getElementById('selectAllMembers');
   
    const userId = emailReportButton.dataset.userId
      
  
    emailReportButton.addEventListener('click', function () {
      emailReport(userId);
    });

    resetPasswordsButton.addEventListener('click', function () {
      const selectedMembers = document.getElementsByName('member')
      const selectedMemberIds = Array.from(selectedMembers).filter(el => el.selected).map(el => el.value)
      resetPasswords(selectedMemberIds);
    });

    selectAllMembersButton.addEventListener('click', function () { 
      
      selectedMembers.forEach(el=>{ el.selected = true })
    });
  }

}     
export { index };