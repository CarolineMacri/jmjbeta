import axios from "axios";
import { showAlert } from "./alerts";

export const changeChildrenYear = (parentId, year) => {
  location.assign(`/children/${parentId}/${year}`);
};

export const toggleModal = () => {
  document
    .querySelector(".form-modal__window")
    .classList.toggle("form-modal__show");
};

export const modalOnClick = (event) => {
  if ((event.target = document.querySelector(".form-modal__window"))) {
    toggleModal();
  }
};

export const fillChildForm = (row) => {
  document.querySelector(".child-profile__form").id = row.id;

  const [childFirstName, childSex, childGrade, x, y] = [...row.children].map(
    (e) => e.innerHTML
  );

  document.getElementById("firstName").value = childFirstName.includes("<div")
    ? ""
    : childFirstName;
  document.getElementById("update").value = childFirstName.includes("<div")
    ? "Add"
    : "Update";

  const sexRadios = document.getElementsByName("sex");
  setChecked(sexRadios, childSex);

  const gradeRadios = document.getElementsByName("grade");
  setChecked(gradeRadios, childGrade);

  document
    .querySelector(".form-modal__window")
    .classList.toggle("form-modal__show");

  function setChecked(radioButtons, checkedValue) {
    radioButtons.forEach((btn) => {
      const isChecked = btn.value == checkedValue;
      btn.checked = isChecked;
    });
  }
};

export const updateChild = async (parentId, data) => {
  try {
    const url = `/api/v1/children${parentId == "new" ? "" : "/" + parentId}`;

    const method = parentId == "new" ? "POST" : "PATCH";

    const res = await axios({
      method,
      url,
      data,
    });

    if (res.data.status == "success") {
      showAlert(
        "success",
        `Child ${res.data.data.child.firstName} ${
          parentId == "new" ? "added" : "updated"
        } successfully`
      );
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const deleteChildModal = async (row) => {
  const childId = row.id;

  const [childFirstName, childSex, childGrade, x, y] = [...row.children].map(
    (e) => e.innerHTML
  );

  const deleteModal = document.querySelector(".delete-modal__window");

  const paragraphs = deleteModal.getElementsByTagName("p");
  paragraphs.item(2).innerHTML =
    childFirstName.toUpperCase() + "   " + childGrade + " grade";

  const deleteChildButton = document.getElementById("deleteChild");

  deleteChildButton.addEventListener("click", function () {
    deleteChild(childId, childFirstName);
  });

  deleteModal.classList.toggle("delete-modal__show");
};

const deleteChild = async (childId, childFirstName) => {
  try {
    const url = `/api/v1/children/${childId}`;

    const res = await axios({
      method: "DELETE",
      url,
    });

    if (res.status == 204) {
      showAlert("success", `${childFirstName} deleted`);
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
