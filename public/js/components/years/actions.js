import axios from 'axios';import { showAlert } from '../../alerts';

export const changeCurrentYear = async (year) => {
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
          isNewYear == 'new' ? 'added' : 'updated'
        } successfully`
      );

      // need in case a new year, need to get the id assigned by mongo
      year = res.data.data.year;
      yearId = year.id;
      window.setTimeout(() => {
        location.replace(`/year_profile/${yearId}`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteYearModal = async (row) => {
  const yearId = row.id;

  const [yearValue, current, x, y] = [...row.children].map((e) => e.innerHTML);

  const deleteModal = document.querySelector('.delete-modal__window');
  deleteModal.classList.toggle('delete-modal__show');

  const paragraphs = deleteModal.getElementsByTagName('p');
  paragraphs.item(2).innerHTML = yearValue;

  var deleteYearButton = document.getElementById('deleteYear');

  deleteYearButton.addEventListener('click', () => {
    deleteYear(yearId);
  });

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
