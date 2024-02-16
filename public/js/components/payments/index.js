/* eslint-disable */ // import 'core-js/stable';// import 'regenerator-runtime/runtime';
import {
  changePaymentsYear,
  updatePayment,
  deletePaymentModal,
  saveFamilyPaymentChanges,
} from './actions';

export function index(a) {

  console.log('payment component');
  // DOM elements=
  const payments = document.querySelector('.payments');
  const paymentProfile = document.querySelector('.payment-profile');

  if (payments) {
    var familyPaymentForm = document.querySelector('.family-payment__form');
    const yearSelect = document.getElementById('year-select');
    const parentId = document.querySelector('.payments__title').id; 

    yearSelect.addEventListener('change', (e) => {
      const newYear = yearSelect.value;
      changePaymentsYear(newYear, parentId);
    });

    familyPaymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const familyId = familyPaymentForm.id;
      const enrollmentStatuses = document.getElementsByName('Enrollment Status')
      const enrollmentStatus = [...enrollmentStatuses].find(x=>x.checked).value
      const paymentReceived = {};
      paymentReceived.date = document.getElementById('paymentReceivedDate').value;
      paymentReceived.order = document.getElementById('paymentReceivedOrder').value; 
      var family = {};
      family = {
        id:familyId,
        enrollmentStatus,
        paymentReceived,
      };

      saveFamilyPaymentChanges(family);
    });

    const paymentsRows = document
      .querySelector('.payments')
      .getElementsByTagName('tr');

    const numRows = paymentsRows.length;

    for (var i = 1; i <= numRows - 2; i++) {
      const dataRow = paymentsRows[i];
      const dataCells = dataRow.getElementsByTagName('td');
      const numCells = dataCells.length;
      const deleteButton = dataCells.item(numCells - 1);

      deleteButton.addEventListener('click', () => {
        deletePaymentModal(dataRow);
      });
    }
    const cancelDelete = document.getElementById('cancelDelete');
    cancelDelete.addEventListener('click', function (e) {
      e.preventDefault();

      document
        .querySelector('.delete-modal__window')
        .classList.toggle('delete-modal__show');
    });
  }

  if (paymentProfile) {
    const paymentProfileForm = document.querySelector('.payment-profile__form');
    if (paymentProfileForm) {
      paymentProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const year = paymentProfile.dataset.selectedYear;
        const isNew = paymentProfile.dataset.isNew == 'new';
        const hasParent = paymentProfile.dataset.hasParent == 'true';
        const paymentId = paymentProfileForm.id;
        const parent = document.getElementById('parent').value;
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
          isNew,
        };

        updatePayment(paymentId, payment, year, hasParent);
      });
    }
  }
}