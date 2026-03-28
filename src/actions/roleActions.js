// src/actions/roleActions.js
import api from '../utils/axiosInstance';
import {
  ROLE_LIST_REQUEST,
  ROLE_LIST_SUCCESS,
  ROLE_LIST_FAIL,
  ROLE_CREATE_REQUEST,
  ROLE_CREATE_SUCCESS,
  ROLE_CREATE_FAIL,
  ROLE_UPDATE_REQUEST,
  ROLE_UPDATE_SUCCESS,
  ROLE_UPDATE_FAIL,
  ROLE_DELETE_REQUEST,
  ROLE_DELETE_SUCCESS,
  ROLE_DELETE_FAIL,
} from '../constants/roleConstants';

export const listRoles = () => async (dispatch) => {
  try {
    dispatch({ type: ROLE_LIST_REQUEST });
    const { data } = await api.get('/api/roles'); // Note: added /api/ prefix to match typical backend routes
    dispatch({ type: ROLE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ROLE_LIST_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const createRole = (roleData) => async (dispatch) => {
  try {
    dispatch({ type: ROLE_CREATE_REQUEST });
    const { data } = await api.post('/api/roles', roleData);
    dispatch({ type: ROLE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ROLE_CREATE_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const updateRole = (id, roleData) => async (dispatch) => {
  try {
    dispatch({ type: ROLE_UPDATE_REQUEST });
    const { data } = await api.put(`/api/roles/${id}`, roleData);
    dispatch({ type: ROLE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ROLE_UPDATE_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const deleteRole = (id) => async (dispatch) => {
  try {
    dispatch({ type: ROLE_DELETE_REQUEST });
    await api.delete(`/api/roles/${id}`);
    dispatch({ type: ROLE_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: ROLE_DELETE_FAIL, payload: error.response?.data?.message || error.message });
  }
};