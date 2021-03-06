import { combineReducers } from 'redux';
import userState from './user';
import generalState from './general';
import courseState from './course';
import subjectState from './subject';
import invoiceState from './invoice';
import lessonState from './lesson';
import discountState from './discount';
import cartState from './cart';
import feedbackState from './feedback';
import commentState from './comment';
import chatState from './chat';

const reducer = combineReducers({
  userState,
  generalState,
  courseState,
  subjectState,
  invoiceState,
  lessonState,
  discountState,
  cartState,
  feedbackState,
  commentState,
  chatState,
});

export default reducer;
