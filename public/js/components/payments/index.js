/* eslint-disable */ // import 'core-js/stable';// import 'regenerator-runtime/runtime';

import { changePaymentsYear, updatePayment, deletePaymentModal} from './actions';

function index(a) {
  // DOM elements=
  const payments = document.querySelector('.payments');
  const paymentProfile = document.querySelector('.payment-profile');

  if (payments) {
    const yearSelect = document.getElementById('year-select');
    const parentId = document.querySelector('.payments__title').id;

    yearSelect.addEventListener('change', (e) => {
      const newYear = yearSelect.value;
      changePaymentsYear(newYear, parentId);
    });

    const paymentsRows = document
      .querySelector('.payments')
      .getElementsByTagName('tr');
    
    const numRows = paymentsRows.length;
    alert('num payments ' + numRows);

    for (var i = 1; i <= numRows - 2; i++){
      const dataRow = paymentsRows[i];
      const dataCells = dataRow.getElementsByTagName('td');
      const numCells = dataCells.length;
      const deleteButton = dataCells.item(numCells - 1);

      deleteButton.addEventListener("click", ()=> {
        deletePaymentModal(dataRow);
      })      
    }
    const cancelDelete = document.getElementById("cancelDelete");
    cancelDelete.addEventListener("click", function (e) {
      e.preventDefault();
      alert('toggling delete')
      document
        .querySelector(".delete-modal__window")
        .classList.toggle("delete-modal__show");
    })
  }

  if (paymentProfile) {
    
    const paymentProfileForm = document.querySelector('.payment-profile__form');
    if (paymentProfileForm) {
      paymentProfileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const year = paymentProfile.dataset.selectedYear;
        alert(year)
        const isNew = paymentProfile.dataset.isNew == 'new';
        const hasParent = paymentProfile.hasParent == 'true';
        const paymentId = paymentProfileForm.id;
        const parent = document.getElementById("parent").value;
        const teacher = document.getElementById('teacher').value;
        const semester = document.getElementById('semester').value;
        const checkNumber = document.getElementById('checkNumber').value;
        const amount = document.getElementById('amount').value;

        const payment = {
          _id: paymentId,
          parent,
          teacher,
          year,
          semester,
          checkNumber,
          amount,
          isNew
        };
        alert(JSON.stringify(payment));
        updatePayment(paymentId, payment, year, hasParent);
      })
    }
  }

  // if (enrollmentProfile) {
  //   const enrollmentProfileForm = document.querySelector(
  //     '.enrollment-profile__form'
  //   );
  //   const saveSelectionsButton = document.querySelector('.btn-save-selections');

  //   saveSelectionsButton.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     const enrollmentSelections = document.getElementsByName('enrollment');
  //     const enrollmentData=[]
  //     enrollmentSelections.forEach((selection) => {
  //       const data = selection.options[selection.selectedIndex].dataset;
  //       enrollmentData.push(
  //         {
  //           _id: data.enrollmentId,
  //           class: data.classId,
  //           child: data.childId
  //         }
  //       )
  //       //alert(Boolean(data.enrollmentId) +" " +  Boolean(data.classId))
  //     });

  //     saveEnrollentSelections(enrollmentData);
  //   });
  //   enrollmentProfileForm.addEventListener('submit', (e) => {
  //     e.preventDefault();

  //     const selectedYear = elementProfile.dataset.selectedYear;
  //     //const isNew = classProfile.dataset.isNew == 'new';

  //     // const classId = classProfileForm.id;
  //     // const course = document.getElementById('course').value;
  //     // const teacher = document.getElementById('teacher').value;
  //     // const sessions = document.getElementById('sessions').value;
  //     // const location = document.getElementById('location').value;
  //     // const semester = document.getElementById('semester').value;
  //     // const time = document.getElementById('time').value;

  //     // const cl = {
  //     //   id: classId,
  //     //   course,
  //     //   teacher,
  //     //   sessions,
  //     //   location,
  //     //   semester,
  //     //   time,
  //     //   year: selectedYear,
  //     //   isNew,
  //     // };
  //     // console.log(cl);

  //   });
  // }
}

export { index };
