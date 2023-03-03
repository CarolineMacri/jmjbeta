import { emailReport } from './actions';

function index(a) {
  alert(' in test')
  const newPage = document.querySelector(".new_page");

  if (newPage) {
    
    const emailReportButton = document.getElementById('emailReport');
    const userId = emailReportButton.dataset.userId
      
  
    emailReportButton.addEventListener('click', function () {
      emailReport(userId);
    });
  }

}     
export { index };