import axios from 'axios';
import { showAlert } from '../../alerts';

export const changeCurrentYear = async (year) => {
  alert(`in change ${year} to current Year`);
  try {
    const method = 'PATCH';
    const url = `/api/v1/years/changeCurrentYear/${year}`;
    const res = await axios({
      method,
      url,
    });

    if ((res.data.status = 'success')) {
      showAlert('success', `${year} is now the current school year`);
    }

    window.setTimeout(() => {
      location.replace(`/years_table`);
    }, 500);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateYear = async (yearId, year) => {
  alert('in updateYear');
  const isNewYear = year.isNew == true;
  const method = isNewYear ? 'POST' : 'PATCH';
  const url = `/api/v1/years/${isNewYear ? '' : '/' + yearId}`;

  try {
    const res = await axios({
      method,
      url,
      data: year,
    });
    if (res.data.status == 'success') {
      showAlert(
        'success',
        `School Year ${res.data.data.year.year} ${
          yearId == 'new' ? 'added' : 'updated'
        } successfully`
      );
      window.setTimeout(() => {
        location.replace(`/year_profile/${yearId}`);
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteYearModal = async (row) => {
  const yearId = row.id;

  const [yearValue, current, x, y] = [...row.children].map((e) => e.innerHTML);

  alert(yearValue + yearId);

  const deleteModal = document.querySelector('.delete-modal__window');
  deleteModal.classList.toggle('delete-modal__show');

  const paragraphs = deleteModal.getElementsByTagName('p');
  paragraphs.item(2).innerHTML = yearValue;

  var deleteYearButton = document.getElementById('deleteYear');

  deleteYearButton.addEventListener('click', () => {
    deleteYear(yearId);
  });

  alert('added delete year top button');
};

export const deleteYear = async (yearId) => {
  try {
    const url = `/api/v1/years/${yearId}`;

    const res = await axios({
      method: 'DELETE',
      url,
    });

    if (res.status == 204) {
      showAlert('success', `Year deleted`);
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
