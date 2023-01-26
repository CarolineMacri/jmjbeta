import axios from "axios";
import { showAlert } from "./alerts";

export const changeFamiliesYear = (year) => {
  location.assign(`/families/${year}`);
};
export const deleteFamily = async (familyId) => {
  const deleteOk = confirm(
    'Are you sure you want to delete this family?' + familyId
  );

  if (deleteOk) {
    alert('you pressed OK');

    try {
      const url = `/api/v1/families/${familyId}`;
      alert(url)
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
