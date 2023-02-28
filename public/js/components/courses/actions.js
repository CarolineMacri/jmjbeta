import axios from "axios";
import { showAlert } from "../../alerts";

export const changeCoursesYear = (year, ownerId) => {
  location.assign(`/courses_table/${year}/${ownerId}`);
};

export const updateCourse = async (
  courseId,
  course,
  selectedYear,
  hasOwner
) => {
  const isNewCourse = course.isNew == true;

  const method = isNewCourse ? "POST" : "PATCH";

  try {
    var url = `/api/v1/courses${isNewCourse ? "" : "/" + course.id}`;
    console.log(`updating  ${course.name} name`);
    const res = await axios({
      method,
      url,
      data: course,
    });

    if (res.data.status == "success") {
      showAlert(
        "success",
        `${course.name} ${
          isNewCourse ? " added " : " updated "
        } successfully`
      );
      course = res.data.data.course;
      window.setTimeout(() => {
        if (hasOwner)
          location.replace(
            `/course_profile/${course.id}/${selectedYear}/${course.owner}`
          );
        else location.replace(`/course_profile/${course.id}/${selectedYear}`);
      }, 500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const deleteCourseModal = async (row) => {
  const courseId = row.id;

  const [courseName, courseGrades, courseFee, x, y] = [...row.children].map(
    (e) => e.innerHTML
  );

  const deleteModal = document.querySelector(".delete-modal__window");

  const paragraphs = deleteModal.getElementsByTagName("p");
  paragraphs.item(2).innerHTML =
    courseName.toUpperCase() + "   " + courseGrades;

  const deleteCourseButton = document.getElementById("deleteCourse");

  deleteCourseButton.addEventListener("click", function () {
    deleteCourse(courseId, courseName);
  });

  deleteModal.classList.toggle("delete-modal__show");
};

export const deleteCourse = async (courseId, courseName) => {
  try {
    const url = `/api/v1/courses/${courseId}`;

    const res = await axios({
      method: "DELETE",
      url,
    });

    if (res.status == 204) {
      showAlert("success", `${courseName} deleted`);
      window.setTimeout(() => {
        location.reload();
      }, 500);

      showAlert("success", `${courseName} successfully deleted`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
