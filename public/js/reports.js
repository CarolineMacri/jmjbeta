export const changeReportChildrenByGradeYear = (year) => {
  location.assign(`/reports/childrenByGrade/${year}`);
};

export const changeReportInvoicesYear = (year, parentId) => {
  location.assign(`/reports/invoices/${year}/${parentId}`);
};

export const changeReportClassListsYear = (year, teacherId) => {
  location.assign(`/reports/classLists/${year}/${teacherId}`);
};

export const changeReportPaymentsYear = (year, teacherId) => {
  location.assign(`/reports/payments/${year}/${teacherId}`);
};

export const changeReportCoursesYear = (year) => {
  location.assign(`/reports/courses/${year}`);
};
