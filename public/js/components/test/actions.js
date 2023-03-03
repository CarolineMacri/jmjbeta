import axios from 'axios';
import { showAlert } from '../../alerts';

export const emailReport = (userId) => {
  alert (`call to api/v1/user/emailReport/${userId}`)
};

// export const updateChild = async (childId, child) => {
//   const isNewChild = child.isNew == true;
//   const method = isNewChild ? 'POST' : 'PATCH';
//   const url = `/api/v1/children${isNewChild ? '' : '/' + childId}`;

//   try {
//     const res = await axios({
//       method,
//       url,
//       data: child,
//     });

//     if (res.data.status == 'success') {
//       showAlert(
//         'success',
//         `Child ${res.data.data.child.firstName} ${
//           childId == 'new' ? 'added' : 'updated'
//         } successfully`
//       );

//       window.setTimeout(() => {
//         location.replace(`/child_profile/${res.data.data.child._id}`);
//       }, 500);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

// export const deleteChildModal = async (row) => {
//   const childId = row.id;

//   const [childFirstName, childSex, childGrade, x, y] = [...row.children].map(
//     (e) => e.innerHTML
//   );

//   const deleteModal = document.querySelector('.delete-modal__window');

//   const paragraphs = deleteModal.getElementsByTagName('p');
//   paragraphs.item(2).innerHTML =
//     childFirstName.toUpperCase() + '   ' + childGrade + ' grade';

//   const deleteChildButton = document.getElementById('deleteChild');

//   deleteChildButton.addEventListener('click', function () {
//     deleteChild(childId, childFirstName);
//   });

//   deleteModal.classList.toggle('delete-modal__show');
// };

// export const deleteChild = async (childId, childFirstName) => {
//   try {
//     const url = `/api/v1/children/${childId}`;

//     const res = await axios({
//       method: 'DELETE',
//       url,
//     });

//     if (res.status == 204) {
//       showAlert('success', `${childFirstName} deleted`);
//       window.setTimeout(() => {
//         location.reload();
//       }, 500);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };
