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
export const register = (name, email, password, phone, companyName, howDidYouHear) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const { data } = await api.post('/api/auth/register', { name, email, password, phone, companyName, howDidYouHear });
    const userData = data.user || data;
    
    dispatch({ type: USER_REGISTER_SUCCESS, payload: userData });
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('userId', userData.id || userData._id);
    
    return userData;
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// Register and Accept Invitation Action
export const registerAndAcceptInvite = (name, password, token) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const { data } = await api.post('/api/invitations/register-accept', { name, password, token });
    const userData = data.user || data;
    
    dispatch({ type: USER_REGISTER_SUCCESS, payload: userData });
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('userId', userData.id || userData._id);
    
    return userData;
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
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

// Google Auth Action
export const googleLogin = (idToken, phone, companyName, howDidYouHear) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const payload = { idToken };
    if (phone) payload.phone = phone;
    if (companyName) payload.companyName = companyName;
    if (howDidYouHear) payload.howDidYouHear = howDidYouHear;

    const { data } = await api.post('/api/auth/google', payload);
    const userData = data.user || data;

    dispatch({ type: USER_LOGIN_SUCCESS, payload: userData });
    // Also dispatch register success so UI treats it as authenticated if picking it from register state
    dispatch({ type: USER_REGISTER_SUCCESS, payload: userData }); 
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('userId', userData.id || userData._id);

    return userData;
  } catch (error) {
    if (error.response?.data?.requiresDetails) {
        throw { requiresDetails: true, message: error.response.data.message };
    }
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