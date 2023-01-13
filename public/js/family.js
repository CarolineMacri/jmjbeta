import axios from "axios";
import { showAlert } from "./alerts";

export const changeFamilyYear = (id, year) => {
  location.assign(`/family/${id}/${year}`);
};

export const addFamily = async (parentId) => {
  try {
    const url = `/api/v1/families`;

    const method = "POST";

    const data = { parent: parentId };

    const res = await axios({
      method,
      url,
      data,
    });

    if (res.data.status == "success") {
      showAlert("success", `Family added successfully`);
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
