// src/store/reducers/authReducer.js
import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
} from '../constants/authConstants';

let userInfoFromStorage;
try {
  userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
} catch (e) {
  console.error('Failed to parse userInfo from localStorage:', e);
  userInfoFromStorage = null;
}

export const authReducer = (state = { userInfo: userInfoFromStorage, isAuthenticated: !!userInfoFromStorage }, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true };
    case USER_REGISTER_SUCCESS:
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload, isAuthenticated: true };
    case USER_REGISTER_FAIL:
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload, isAuthenticated: false };
    default:
      return state;
  }
};
