export const changeFamiliesYear = (year) => {
  location.assign(`/families/${year}`);
};
export const deleteFamily = (familyId) => {
  confirm('Are you sure you want to delete this family?' + familyId)
}
