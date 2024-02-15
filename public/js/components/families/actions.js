import axios from 'axios';
import { showAlert } from '../../alerts';

export const changeFamilyYear = (id, year) => {
  location.assign(`/family/${id}/${year}`);
};

export const modalOnClick = (event) => {
  if ((event.target = document.querySelector('.form-modal__window'))) {
    toggleModal();
  }
};

export const addFamily = async (parentId, year) => {
  try {
    
    const url = `/api/v1/families`;
    const method = 'POST';
    const data = { parent: parentId, year: year };

    const res = await axios({
      method,
      url,
      data,
    });

    if (res.data.status == 'success') {
      showAlert('success', `Family added successfully`);
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const existsFamilyForYear = async (parentId, year) => {
  try {
    const url = `/api/v1/families/?parent=${parentId}&year=${year}`;
    const method = 'GET';
    const data = { parent: parentId };
    const res = await axios({
      method,
      url,
      data,
    });
    if (res.data.status == 'success') {
      return res.data.results != 0;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const changeFamiliesYear = (year) => {
  location.assign(`/families/${year}`);
};
export const deleteFamily = async (familyId) => {
  const deleteOk = confirm(
    'Are you sure you want to delete this family?' + familyId 
  );

  if (deleteOk) {
    try {
      const url = `/api/v1/families/${familyId}`;
      const res = await axios({
        method: 'DELETE',
        url,
      });

      if (res.status == 204) {
        showAlert('success', `Family deleted`);
        window.setTimeout(() => {
          location.reload();
        }, 500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  }
};
