// src/store/actions/authActions.js
import api from '../utils/axiosInstance';
import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
} from '../constants/authConstants';

// Register Action
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const { data } = await api.post('/api/auth/register', { name, email, password });
    const userData = data.user || data;
    
    dispatch({ type: USER_REGISTER_SUCCESS, payload: userData });
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('userId', userData.id || userData._id);
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Login Action
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const { data } = await api.post('/api/auth/login', { email, password });
    const userData = data.user || data;
    
    dispatch({ type: USER_LOGIN_SUCCESS, payload: userData });
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('userId', userData.id || userData._id);
    
    return userData;
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// Logout Action
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('userId');
  dispatch({ type: USER_LOGOUT });
  window.location.href = '/log-in';
};