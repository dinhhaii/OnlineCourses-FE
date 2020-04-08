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
import { getUser, updateUser } from '../api/user';
import { getCourseList } from '../api/course';
import { getInvoiceLearnerList } from '../api/invoice';
import { getSubjectList } from '../api/subject';
import { showLoading, hideLoading } from '../actions/general';
import { fetchUserSuccess, fetchUserFailed, setIsLogin } from '../actions/user';
import {
  fetchCourseListSuccess,
  fetchCourseListFailed,
} from '../actions/course';
import {
  fetchSubjectListSuccess,
  fetchSubjectListFailed,
} from '../actions/subject';

import {
  fetchInvoiceLearnerListSuccess,
  fetchInvoiceLearnerListFailed,
} from '../actions/invoice';

function* rootSaga() {
  yield takeEvery(actionTypes.FETCH_USER, fetchUserSaga);
  yield takeLatest(actionTypes.UPDATE_USER, updateUserSaga);
  yield takeLatest(actionTypes.CHANGE_PASSWORD, changePasswordSaga);
  yield takeLatest(actionTypes.FETCH_COURSE_LIST, fetchCourseListSaga);
  yield takeLatest(actionTypes.FETCH_SUBJECT_LIST, fetchSubjectListSaga);
  yield takeLatest(
    actionTypes.FETCH_INVOICE_LEARNER_LIST,
    fetchInvoiceLearnerListSaga,
  );
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
    toast.error('Sorry, something wrong!');
  }
  yield delay(1000);
  yield put(hideLoading());
}

function* fetchCourseListSaga() {
  yield put(showLoading());
  const { data } = yield call(getCourseList);
  if (data) {
    yield put(fetchCourseListSuccess(data));
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
    yield put(fetchSubjectListSuccess(data));
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
    yield put(fetchInvoiceLearnerListSuccess(data));
  } else {
    yield put(fetchInvoiceLearnerListFailed());
    toast.error('Cannot fetch invoice learner list!');
  }
  yield put(hideLoading());
}

export default rootSaga;