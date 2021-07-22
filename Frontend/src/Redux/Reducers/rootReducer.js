import { combineReducers } from "redux";

import bookReducer from './bookReducer';
import userReducer from './userReducer';

export default combineReducers({
  users: userReducer,
  books: bookReducer
});