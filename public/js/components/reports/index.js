/* eslint-disable */ // import 'core-js/stable';// import 'regenerator-runtime/runtime';
import {
  changeReportChildrenYear,
  changeReportInvoicesYear,
  changeReportClassListsYear,
  changeReportPaymentsYear,
  changeReportCoursesYear,
} from './actions';

export function index(a) {

    console.log('report component');

    //DOM elements
    const reportChildren = document.querySelector('.report-children');
    const reportInvoices = document.querySelector('.report-invoices');
    const reportPayments = document.querySelector('.report-payments');
    const reportClassLists = document.querySelector('.report-class-lists');
    const reportCourses = document.querySelector('.report-courses');

    if (reportChildren) {
        const yearSelect = document.getElementById('year-select');
        yearSelect.addEventListener('change', (e) => {
            const newYear = yearSelect.value;

            changeReportChildrenYear(newYear);
        });
    }

    if (reportInvoices) {
        const yearSelect = document.getElementById('year-select');
        const parentId = document.querySelector('.invoices-title').id;
        yearSelect.addEventListener('change', (e) => {
            const newYear = yearSelect.value;
            changeReportInvoicesYear(newYear, parentId);
        });
    }

    if (reportPayments) {
        const yearSelect = document.getElementById('year-select');
        const teacherId = document.querySelector('.payments-title').id;
        yearSelect.addEventListener('change', (e) => {
            const newYear = yearSelect.value;
            changeReportPaymentsYear(newYear, teacherId);
        });
    }

    if (reportClassLists) {
        const yearSelect = document.getElementById('year-select');
        const teacherId = document.querySelector('.class-lists-title').id;
        yearSelect.addEventListener('change', (e) => {
            const newYear = yearSelect.value;
            changeReportClassListsYear(newYear, teacherId);
        });
    }

    if (reportCourses) {
        const yearSelect = document.getElementById('year-select');

        yearSelect.addEventListener('change', (e) => {
            const newYear = yearSelect.value;
            changeReportCoursesYear(newYear);
        });
    }
}