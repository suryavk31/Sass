import axios from "axios";
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
} from "../constants/employeeConstants";

// List employees for the current manager (user)
export const listEmployees = () => async (dispatch, getState) => {
  try {
    dispatch({ type: EMPLOYEE_LIST_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
      params: { user: userInfo._id },
    };
    const { data } = await axios.get("/api/employees", config);
    dispatch({ type: EMPLOYEE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: EMPLOYEE_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Create a new employee
export const createEmployee = (employeeData) => async (dispatch, getState) => {
  try {
    dispatch({ type: EMPLOYEE_CREATE_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` },
    };
    const { data } = await axios.post("/api/employees", employeeData, config);
    dispatch({ type: EMPLOYEE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: EMPLOYEE_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update an employee
export const updateEmployee = (id, employeeData) => async (dispatch, getState) => {
  try {
    dispatch({ type: EMPLOYEE_UPDATE_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` },
    };
    const { data } = await axios.put(`/api/employees/${id}`, employeeData, config);
    dispatch({ type: EMPLOYEE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: EMPLOYEE_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete an employee
export const deleteEmployee = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: EMPLOYEE_DELETE_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };
    await axios.delete(`/api/employees/${id}`, config);
    dispatch({ type: EMPLOYEE_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: EMPLOYEE_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Add a task record to an employee's record
export const addTaskRecord = (employeeId, recordData) => async (dispatch, getState) => {
  try {
    dispatch({ type: EMPLOYEE_ADD_TASK_RECORD_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` },
    };
    const { data } = await axios.post(`/api/employees/${employeeId}/task-records`, recordData, config);
    dispatch({ type: EMPLOYEE_ADD_TASK_RECORD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: EMPLOYEE_ADD_TASK_RECORD_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
