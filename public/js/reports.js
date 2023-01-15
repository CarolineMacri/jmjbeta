export const changeReportChildrenByGradeYear = (year,) => {
  location.assign(`/reports/childrenByGrade/${year}`);
};

export const changeReportInvoicesYear = (year, parentId) => {
  location.assign(`/reports/invoices/${year}/${parentId}`);
};
