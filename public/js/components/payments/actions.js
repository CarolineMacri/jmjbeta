import axios from 'axios';import { showAlert } from '../../alerts';

export const changePaymentsYear = (year, parentId) => {
  location.assign(`/payments_table/${year}/${parentId}`);
};

export const updatePayment = async (
  paymentId,
  payment,
  selectedYear,
  hasParent
) => {
  const isNewPayment = payment.isNew == true;
  const method = isNewPayment ? 'POST' : 'PATCH';

  try {
    var url = `/api/v1/payments${isNewPayment ? '' : '/' + payment._id}`;

    const res = await axios({
      method,
      url,
      data: payment,
    });

    if (res.data.status == 'success') {
      showAlert(
        'success',
        `Check ${payment.checkNumber} : $${payment.amount} ${
          isNewPayment? ' added ' : ' updated '
        } successfully`
      );
      payment = res.data.data.payment;
      window.setTimeout(() => {
        if (hasParent) {
          const parentId = isNewPayment ? payment.parent : payment.parent._id;
          location.replace(
            `/payment_profile/${payment.id}/${selectedYear}/${parentId}`
          );
        }
        else location.replace(`/payment_profile/${payment.id}/${selectedYear}`);
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deletePaymentModal = async (row) => {

  const paymentId = row.id;

  const [parentName, teacherName, checkNumber, semester, amount, x, y] = [
    ...row.children,
  ].map((e) => e.innerHTML);

  const deleteModal = document.querySelector('.delete-modal__window');
  const paragraphs = deleteModal.getElementsByTagName('p');
  paragraphs.item(2).innerHTML =
    parentName.toUpperCase() + ' Check: ' + checkNumber;
  const deletePaymentButton = document.getElementById('deletePayment');
  deletePaymentButton.addEventListener('click', () => {
    deletePayment(paymentId, parentName);
  });
  deleteModal.classList.toggle('delete-modal__show');
};

export const deletePayment = async (paymentId, parentName) => {
  try {
    const url = `/api/v1/payments/${paymentId}`;

    const res = await axios({
      method: 'DELETE',
      url,
    });

    if (res.status == 204) {
      showAlert('success', `${parentName} payment successfully deleted`);
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.respons.data.message);
  }
};
