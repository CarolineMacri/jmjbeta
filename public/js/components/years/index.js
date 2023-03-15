/* eslint-disable */ // import 'core-js/stable';// import 'regenerator-runtime/runtime';

import { showAlert } from '../../alerts';

import { changeCurrentYear, updateYear, deleteYearModal } from './actions';

function index(a) {
  // DOM elements

  const years = document.querySelector('.years');
  const yearProfile = document.querySelector('.year-profile');

  if (years) {
    const yearRadios = document.getElementsByName('current');

    for (radio of yearRadios) {
      var radio;
      const newCurrentYear = radio.id;
      radio.addEventListener('change', (e) => {
        e.preventDefault();
        changeCurrentYear(newCurrentYear);
      });
    }

    const yearsRows = document
      .querySelector('.years')
      .getElementsByTagName('tr');

    const numRows = yearsRows.length;

    for (var i = 1; i <= numRows - 2; i++) {
      const dataRow = yearsRows[i];
      const dataCells = dataRow.getElementsByTagName('td');
      const numCells = dataCells.length;

      const deleteButton = dataCells.item(numCells - 1);

      deleteButton.addEventListener('click', (e) => {
        deleteYearModal(dataRow);
      });
      const [yearValue, current, x, y] = [...dataRow.children].map(
        (e) => e.innerHTML
      );
    }

    const cancelDelete = document.getElementById('cancelDelete');
    cancelDelete.addEventListener('click', function (e) {
      e.preventDefault();

      document
        .querySelector('.delete-modal__window')
        .classList.toggle('delete-modal__show');
    });
  }

  if (yearProfile) {
    const yearProfileForm = document.querySelector('.year-profile__form');

    yearProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNew = yearProfile.dataset.isNew == 'new';

      const yearId = yearProfileForm.id;
      const yearValue = document.getElementById('year').value;
      const registrationCloseDate = document.getElementById(
        'registrationCloseDate'
      ).value;

      const courseEditCloseDate = document.getElementById(
        'courseEditCloseDate'
      ).value;
      const coursePreviewOpenDate = document.getElementById(
        'coursePreviewOpenDate'
      ).value;
      const enrollmentOpenDate =
        document.getElementById('enrollmentOpenDate').value;
      const enrollmentCloseDate = document.getElementById(
        'enrollmentCloseDate'
      ).value;

      const year = {
        id: yearId,
        year: yearValue,
        registrationCloseDate,
        courseEditCloseDate,
        coursePreviewOpenDate,
        enrollmentOpenDate,
        enrollmentCloseDate,
        isNew,
      };

      updateYear(yearId, year);
    });
  }
}

export { index };
