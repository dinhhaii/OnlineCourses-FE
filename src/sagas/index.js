/* eslint-disable no-underscore-dangle */
import {
  takeLatest,
  call,
  put,
  delay,
  select,
  takeEvery,
} from 'redux-saga/effects';
import { toast } from 'react-toastify';
import bcrypt from 'bcryptjs';
import * as actionTypes from '../utils/actionTypes';
import { AUTH_TOKEN } from '../utils/constant';
import { getUser, updateUser, getUserList } from '../api/user';
import {
  getCourseList, getCourseLecturerList, getCourse, getCourseByLessonId, createCourse, updateCourse, 
} from '../api/course';
import { getInvoiceLearnerList, getInvoiceLecturerList, createInvoice, updateInvoice } from '../api/invoice';
import { getSubjectList } from '../api/subject';
import { createDiscount, updateDiscount } from '../api/discount';
import { showLoading, hideLoading } from '../actions/general';
import {
  fetchUserSuccess, fetchUserFailed, setIsLogin, fetchUserListSuccess, fetchUserListFailed, 
} from '../actions/user';
import {
  fetchCourseListSuccess,
  fetchCourseListFailed,
  fetchCourseLecturerListSuccess,
  fetchCourseLecturerListFailed,
  fetchCourseSuccess,
  fetchCourseFailed,
} from '../actions/course';
import {
  fetchSubjectListSuccess,
  fetchSubjectListFailed,
} from '../actions/subject';

import {
  fetchInvoiceLearnerListSuccess,
  fetchInvoiceLearnerListFailed,
  fetchInvoiceLecturerListSuccess,
  fetchInvoiceLecturerListFailed,
  fetchInvoiceList,
} from '../actions/invoice';
import { getLesson, createLesson, updateLesson } from '../api/lesson';
import { fetchLessonSuccess, fetchLessonFailed } from '../actions/lesson';
import { fetchDiscountSuccess } from '../actions/discount';
import { fetchCartSuccess, fetchCartFailed, fetchUpdatedCartSuccess } from '../actions/cart';
import { getCart, updateCart } from '../api/cart';

function* rootSaga() {
  yield takeEvery(actionTypes.FETCH_USER, fetchUserSaga);
  yield takeLatest(actionTypes.CREATE_INVOICE, createInvoiceSaga);
  yield takeLatest(actionTypes.UPDATE_INVOICE, updateInvoiceSaga);
  yield takeLatest(actionTypes.FETCH_CART, fetchCartSaga);
  yield takeLatest(actionTypes.UPDATE_CART, updateCartSaga);
  yield takeLatest(actionTypes.FETCH_LESSON, fetchLessonSaga);
  yield takeLatest(actionTypes.CREATE_LESSON, createLessonSaga);
  yield takeLatest(actionTypes.UPDATE_LESSON, updateLessonSaga);
  yield takeLatest(actionTypes.FETCH_USER_LIST, fetchUserListSaga);
  yield takeLatest(actionTypes.UPDATE_USER, updateUserSaga);
  yield takeLatest(actionTypes.CHANGE_PASSWORD, changePasswordSaga);
  yield takeLatest(actionTypes.FETCH_COURSE, fetchCourseSaga);
  yield takeLatest(actionTypes.CREATE_COURSE, createCourseSaga);
  yield takeLatest(actionTypes.UPDATE_COURSE, updateCourseSaga);
  yield takeLatest(actionTypes.CREATE_DISCOUNT, createDiscountSaga);
  yield takeLatest(actionTypes.UPDATE_DISCOUNT, updateDiscountSaga);
  yield takeLatest(actionTypes.FETCH_COURSE_BY_LESSON, fetchCourseByLessonSaga);
  yield takeLatest(actionTypes.FETCH_COURSE_LIST, fetchCourseListSaga);
  yield takeLatest(actionTypes.FETCH_SUBJECT_LIST, fetchSubjectListSaga);
  yield takeLatest(
    actionTypes.FETCH_INVOICE_LEARNER_LIST,
    fetchInvoiceLearnerListSaga,
  );
  yield takeLatest(
    actionTypes.FETCH_INVOICE_LECTURER_LIST,
    fetchInvoiceLecturerListSaga,
  );
  yield takeLatest(
    actionTypes.FETCH_COURSE_LECTURER_LIST,
    fetchCourseLecturerListSaga,
  );
}

function* fetchUserListSaga() {
  yield put(showLoading());
  const { data } = yield call(getUserList);
  if (data) {
    yield put(fetchUserListSuccess(data));
  } else {
    yield put(fetchUserListFailed());
    toast.error('Cannot fetch user list!');
  }
  yield put(hideLoading());
}

function* updateUserSaga({ user }) {
  yield put(showLoading());
  const { userState } = yield select();
  const { data } = yield call(updateUser, {
    _idUser: userState.user._id,
    password: userState.user.password,
    type: userState.user.type,
    ...user,
  });
  if (data) {
    yield put(fetchUserSuccess({ user: data }));
    toast.success('Updated successfully!');
  } else {
    toast.error('Something wrong!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* changePasswordSaga({ currentPassword, password, rpassword }) {
  yield put(showLoading());
  const state = yield select();
  const { user } = state.userState;
  if (bcrypt.compareSync(currentPassword, user.password)) {
    if (password === rpassword) {
      const { data } = yield call(updateUser, {
        _idUser: user._id,
        password,
        type: user.type,
      });
      if (data) {
        yield put(fetchUserSuccess({ user: data }));
        toast.success('You changed password successfully!');
      }
    } else {
      toast.warn('Your new password does not match!');
    }
  } else {
    toast.warn('Your current password is wrong!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* fetchUserSaga({ email, password }) {
  yield put(showLoading());
  const { data } = yield call(getUser, email, password);
  if (data) {
    yield put(fetchUserSuccess(data));
    yield put(setIsLogin());
    yield select((state) => {
      const { firstName, lastName } = state.userState.user;
      localStorage.setItem(AUTH_TOKEN, state.userState.token);
      toast.success(`Hi ${firstName} ${lastName}`);
    });
  } else {
    yield put(fetchUserFailed());
    toast.error('Sorry, fetching user failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* fetchCourseListSaga() {
  yield put(showLoading());
  const { data } = yield call(getCourseList);
  if (data) {
    yield put(fetchCourseListSuccess(data.filter(e => !e.isDelete)));
  } else {
    yield put(fetchCourseListFailed());
    toast.error('Cannot fetch courses list!');
  }
  yield put(hideLoading());
}

function* fetchSubjectListSaga() {
  yield put(showLoading());
  const { data } = yield call(getSubjectList);
  if (data) {
    yield put(fetchSubjectListSuccess(data.filter(e => !e.isDelete)));
  } else {
    yield put(fetchSubjectListFailed());
    toast.error('Cannot fetch subject list!');
  }
  yield put(hideLoading());
}

function* fetchInvoiceLearnerListSaga({ _id }) {
  yield put(showLoading());
  const { data } = yield call(getInvoiceLearnerList, _id);
  if (data) {
    yield put(fetchInvoiceLearnerListSuccess(data.filter(e => !e.isDelete)));
  } else {
    yield put(fetchInvoiceLearnerListFailed());
    toast.error('Cannot fetch invoice learner list!');
  }
  yield put(hideLoading());
}

function* fetchInvoiceLecturerListSaga({ _id }) {
  yield put(showLoading());
  const { data } = yield call(getInvoiceLecturerList, _id);
  console.log(data);
  if (data) {
    yield put(fetchInvoiceLecturerListSuccess(data.filter(e => !e.isDelete)));
  } else {
    yield put(fetchInvoiceLecturerListFailed());
    toast.error('Cannot fetch invoice lecturer list!');
  }
  yield put(hideLoading());
}

function* fetchCourseLecturerListSaga({ _id }) {
  yield put(showLoading());
  const { data } = yield call(getCourseLecturerList, _id);
  if (data) {
    yield put(fetchCourseLecturerListSuccess(data.filter(e => !e.isDelete)));
  } else {
    yield put(fetchCourseLecturerListFailed());
    toast.error('Cannot fetch course lecturer list!');
  }
  yield put(hideLoading());
}

function* fetchCourseSaga({ _id }) {
  yield put(showLoading());
  const { data } = yield call(getCourse, _id);
  if (data) {
    yield put(fetchCourseSuccess(data));
  } else {
    yield put(fetchCourseFailed());
    toast.error('Sorry, fetch course failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* fetchLessonSaga({ _id }) {
  yield put(showLoading());
  const { data } = yield call(getLesson, _id);
  if (data) {
    yield put(fetchLessonSuccess(data));
  } else {
    yield put(fetchLessonFailed());
    toast.error('Sorry, fetch lesson failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* fetchCourseByLessonSaga({ _id }) {
  yield put(showLoading());
  const { data } = yield call(getCourseByLessonId, _id);
  if (data) {
    yield put(fetchCourseSuccess(data));
  } else {
    yield put(fetchCourseFailed());
    toast.error('Sorry, fetch course by lesson failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* createCourseSaga({ course }) {
  yield put(showLoading());
  const { data } = yield call(createCourse, course);
  if (data) {
    yield put(fetchCourseSuccess(data));
    toast.success('Created successfully!');
  } else {
    toast.error('Sorry, created failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* updateCourseSaga({ course }) {
  yield put(showLoading());
  const { data } = yield call(updateCourse, course);
  if (data) {
    yield put(fetchCourseSuccess(data));
    toast.success('Updated successfully!');
  } else {
    toast.error('Sorry, updated failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* createLessonSaga({ lesson }) {
  yield put(showLoading());
  const { data } = yield call(createLesson, lesson);
  if (data) {
    yield put(fetchLessonSuccess(data));
    toast.success('Created successfully!');
  } else {
    toast.error('Sorry, created failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* updateLessonSaga({ lesson }) {
  yield put(showLoading());
  const { data } = yield call(updateLesson, lesson);
  if (data) {
    yield put(fetchLessonSuccess(data));
    toast.success('Updated successfully!');
  } else {
    toast.error('Sorry, updated failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* createDiscountSaga({ discount }) {
  yield put(showLoading());
  const { data } = yield call(createDiscount, discount);
  if (data) {
    yield put(fetchDiscountSuccess(data));
    toast.success('Created successfully!');
  } else {
    toast.error('Sorry, created failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* updateDiscountSaga({ discount }) {
  yield put(showLoading());
  const { data } = yield call(updateDiscount, discount);
  if (data) {
    yield put(fetchDiscountSuccess(data));
    toast.success('Updated successfully!');
  } else {
    toast.error('Sorry, updated failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* fetchCartSaga({ _id }) {
  yield put(showLoading());
  const { data } = yield call(getCart, _id);
  if (data) {
    yield put(fetchCartSuccess(data));
  } else {
    yield put(fetchCartFailed());
    toast.error('Sorry, fetch lesson failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* updateCartSaga({ cart }) {
  yield put(showLoading());
  const { data } = yield call(updateCart, cart);
  if (data) {
    yield put(fetchUpdatedCartSuccess(data));
    toast.success('Updated successfully!');
  } else {
    toast.error('Sorry, updated failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* createInvoiceSaga({ invoice }) {
  yield put(showLoading());
  const { data } = yield call(createInvoice, invoice);
  const { invoiceState } = yield select();
  console.log('create invoice', data);
  if (data) {
    yield put(fetchInvoiceList([...invoiceState.invoiceList, data]));
    toast.success('Created successfully!');
  } else {
    toast.error('Sorry, created failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* updateInvoiceSaga({ discount }) {
  yield put(showLoading());
  const { data } = yield call(updateInvoice, discount);
  const { invoiceState } = yield select();
  console.log('update invoice', data);
  if (data) {
    yield put(fetchInvoiceList([...invoiceState.invoiceList, data]));
    toast.success('Updated successfully!');
  } else {
    toast.error('Sorry, updated failed!');
  }
  yield delay(1000);
  yield put(hideLoading());
}
export default rootSaga;
