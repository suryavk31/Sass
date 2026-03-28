// src/actions/employeeActions.js
import api from '../utils/axiosInstance';
import {
  EMPLOYEE_LIST_REQUEST,
  EMPLOYEE_LIST_SUCCESS,
  EMPLOYEE_LIST_FAIL,
  EMPLOYEE_CREATE_REQUEST,
  EMPLOYEE_CREATE_SUCCESS,
  EMPLOYEE_CREATE_FAIL,
  EMPLOYEE_UPDATE_REQUEST,
  EMPLOYEE_UPDATE_SUCCESS,
  EMPLOYEE_UPDATE_FAIL,
  EMPLOYEE_DELETE_REQUEST,
  EMPLOYEE_DELETE_SUCCESS,
  EMPLOYEE_DELETE_FAIL,
  EMPLOYEE_ADD_TASK_RECORD_REQUEST,
  EMPLOYEE_ADD_TASK_RECORD_SUCCESS,
  EMPLOYEE_ADD_TASK_RECORD_FAIL,
} from '../constants/employeeConstants';

export const listEmployees = () => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_LIST_REQUEST });
    const { data } = await api.get('/api/employees');
    dispatch({ type: EMPLOYEE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: EMPLOYEE_LIST_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const createEmployee = (employeeData) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_CREATE_REQUEST });
    const { data } = await api.post('/api/employees', employeeData);
    dispatch({ type: EMPLOYEE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: EMPLOYEE_CREATE_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const updateEmployee = (id, employeeData) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_UPDATE_REQUEST });
    const { data } = await api.put(`/api/employees/${id}`, employeeData);
    dispatch({ type: EMPLOYEE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: EMPLOYEE_UPDATE_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const deleteEmployee = (id) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_DELETE_REQUEST });
    await api.delete(`/api/employees/${id}`);
    dispatch({ type: EMPLOYEE_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: EMPLOYEE_DELETE_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const addTaskRecord = (employeeId, recordData) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEE_ADD_TASK_RECORD_REQUEST });
    const { data } = await api.post(`/api/employees/${employeeId}/task-records`, recordData);
    dispatch({ type: EMPLOYEE_ADD_TASK_RECORD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: EMPLOYEE_ADD_TASK_RECORD_FAIL, payload: error.response?.data?.message || error.message });
  }
};
