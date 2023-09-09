import axios from 'axios';
import { showAlert } from './alerts';

export const changeUsersYear = (year) => {
  location.assign(`/users/${year}`);
};

export const toggleModalUser = () => {
  document
    .querySelector('.form-modal__window')
    .classList.toggle('form-modal__show');
};

export const userModalOnClick = (event) => {
  if ((event.target = document.querySelector('.form-modal__window'))) {
    toggleModalUser();
  }
};

export const fillUserForm = (row) => {
  const userForm = document.querySelector('.user-profile__form');
  userForm.id = row.id;
  userForm.dataset.registrationYears = row.dataset.registrationYears;

  if (Array.isArray(row)) {
  } else {
    var [
      userLastName,
      userFirstName,
      userEmail,
      userCellPhone,
      userRoles,
      x,
      y,
    ] = [...row.children].map((e) => e.innerHTML);
  }

  const newUser = userLastName.includes('<div');

  if (newUser) {
    userLastName = '';
    userFirstName = '';
    userEmail = '';
    userCellPhone = '';
    userRoles = '';
  }

  document.getElementById('lastName').value = userLastName;
  document.getElementById('firstName').value = userFirstName;
  document.getElementById('email').value = userEmail;
  document.getElementById('cellPhone').value = userCellPhone.replace(
    /(\d{3})(\d{3})(\d{4})/,
    '$1-$2-$3'
  );
  document.getElementById('update').value = newUser ? 'Add' : 'Update';

  const roleCheckBoxes = document.getElementsByName('roles');
  setChecked(roleCheckBoxes, userRoles);

  document
    .querySelector('.form-modal__window')
    .classList.toggle('form-modal__show');

  function setChecked(checkBoxes, checkedValues) {
    checkBoxes.forEach((checkBox) => {
      const isChecked = checkedValues.includes(checkBox.value);
      checkBox.checked = isChecked;
      checkBox.dataset.exists = isChecked;
    });
  }

  const parentCheckbox = document.getElementById('parent');
  const teacherCheckbox = document.getElementById('teacher');

  parentCheckbox.addEventListener('change', (e) => {
    e.preventDefault();
    // parent exists and was unchecked
    var exists = parentCheckbox.dataset.exists == 'true';
    var unchecked = !parentCheckbox.checked;

    if (exists && unchecked) {
      alert(
        'Parent must be deleted using Administration - Families - Delete this family'
      );
      parentCheckbox.checked = true;
    }
  });

  teacherCheckbox.addEventListener('change', handleTeacherCheckBoxChange); 
};

async function handleTeacherCheckBoxChange(e) {
  e.preventDefault();
  // teacher exists and was unchecked
  const teacherCheckbox = document.getElementById('teacher');
  var exists = teacherCheckbox.dataset.exists == 'true';
  var unchecked = !teacherCheckbox.checked;
  const selectedYear = document.getElementById('year-select').value;

  const url = `/api/v1/classes`;
  const method = 'GET';
  const res = await axios({
    method,
    url,
  });
  var classes = res.data.data.classes;
  const teacherId = document.querySelector('.user-profile__form').id;

  classes = classes.filter((cl) => {
    return cl.year == selectedYear && cl.teacher == teacherId; 
  });

  const cantRemoveRole = classes.length > 0 && unchecked && exists;
  if (cantRemoveRole) {
    alert(
      `Teacher role for ${document.getElementById('lastName').value} cannot be removed until ${classes.length} classes are deleted`
    );
    teacherCheckbox.checked = true;
  }
  // else {
  //   teacherCheckbox.checked = false;
  // }
    
}

export const updateUser = async (userId, data) => {
  try {
    const url = `/api/v1/users/${userId == 'new' ? '' : '/' + userId}`;

    const method = userId == 'new' ? 'POST' : 'PATCH';

    if (userId === 'new') {
      const randomPassword =
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2).toUpperCase();

      data.password = randomPassword;
      data.passwordConfirm = randomPassword;
    }

    const res = await axios({
      method,
      url,
      data,
    });

    if (res.data.status == 'success') {
      showAlert(
        'success',
        `User ${userId == 'new' ? 'added' : 'updated'} successfully`
      );
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }

    return res.data.data.user._id;
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteUserModal = async (row) => {
  const userId = row.id;

  const [
    userLastName,
    userFirstName,
    userEmail,
    userCellPhone,
    userRoles,
    x,
    y,
  ] = [...row.children].map((e) => e.innerHTML);

  const deleteModal = document.querySelector('.delete-modal__window');

  const paragraphs = deleteModal.getElementsByTagName('p');
  paragraphs.item(2).innerHTML =
    userFirstName.toUpperCase() + '   ' + userLastName.toUpperCase();

  const deleteUserButton = document.getElementById('deleteUser');

  deleteUserButton.addEventListener('click', function () {
    deleteUser(userId, userFirstName);
  });

  deleteModal.classList.toggle('delete-modal__show');
};

const deleteUser = async (userId, userFirstName) => {
  try {
    const url = `/api/v1/users/${userId}`;

    const res = await axios({
      method: 'DELETE',
      url,
    });

    if (res.status == 204) {
      showAlert('success', `${userFirstName} deleted`);
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
