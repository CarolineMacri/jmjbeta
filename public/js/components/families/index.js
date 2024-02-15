/* eslint-disable */ // import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import {
  changeFamilyYear,
  changeFamiliesYear,
  deleteFamily,
} from './actions';

function index(a) {
  // DOM
  const family = document.querySelector('.family');
  const families = document.querySelector('.families');

  if (families) {
    const yearSelect = document.getElementById('year-select');
    const editFamilyButtons = Array.from(
      document.getElementsByClassName('edit-family')
    );
    const deleteFamilyButtons = Array.from(
      document.getElementsByClassName('delete-family')
    );
  
    yearSelect.addEventListener('change', (e) => {
      const newYear = yearSelect.value;
  
      changeFamiliesYear(newYear);
    });
  
    if (editFamilyButtons) {
      editFamilyButtons.forEach((btn) => {
        btn.addEventListener('click', () => { });
      });
    }
  
    if (deleteFamilyButtons) {
      deleteFamilyButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          deleteFamily(btn.dataset.family_id);
        });
      });
    }
  }

  if (family) {
    const yearSelect = document.getElementById('year-select');
  
    yearSelect.addEventListener('change', (e) => {
      const newYear = yearSelect.value;
      const id = window.location.pathname.split('/')[2];
  
      changeFamilyYear(id, newYear);
    });
  }
}

export { index };
