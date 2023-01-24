export const changeRegistrationsYear = (year) => {
  location.assign(`/registrations_table/${year}`);
};
export const updateRegistration = async (registeredUser, selectedYear) => {
  const method = 'PATCH';
  alert('stub for update user registration years')

  // try {
  //   const url = `/api/v1/users${registeredUser.id}`;
  //   //console.log(`updating  ${course.name} name`);
  //   const res = await axios({
  //     method,
  //     url,
  //     data: registered,
  //   });

  //   if (res.data.status == 'success') {
  //     showAlert('success', `${registeredUser.lastName}  updated successfully`);
  //     registeredUser = res.data.data.user;
  //     window.setTimeout(() => {
  //       location.replace(
  //         `/registration_profile/${selectedYear}/${registeredUser.id}`
  //       );
  //     }, 500);
  //   }
  // } catch (err) {
  //   showAlert('error', err.response.data.message);
  // }
};
