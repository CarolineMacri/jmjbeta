/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { ObjectId } from 'mongodb';

console.log('in index');

import { index as children } from './components/children/index';
children();

import { index as courses } from './components/courses/index';
courses();

import { index as enrollments } from './components/enrollments/index';
enrollments();

import { index as families } from './components/families/index';
families();

import { index as logins } from './components/logins/index';
logins();

import { index as payments } from './components/payments/index';
payments();

import { index as registrations } from './components/registrations/index';
registrations();

import { index as reports } from './components/reports/index';
reports();

import { index as sessions } from './components/classes/index';
sessions();

import { index as teachers } from './components/teachers/index';
teachers();

import { index as test } from './components/test/index';
test();

import { index as users } from './components/users/index';
users();

import { index as years } from './components/years/index';
years();