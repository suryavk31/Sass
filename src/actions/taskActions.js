// src/redux/actions/taskActions.js
import axios from 'axios';
import {
  TASK_LIST_REQUEST,
  TASK_LIST_SUCCESS,
  TASK_LIST_FAIL,
  TASK_CREATE_REQUEST,
  TASK_CREATE_SUCCESS,
  TASK_CREATE_FAIL,
  TASK_UPDATE_REQUEST,
  TASK_UPDATE_SUCCESS,
  TASK_UPDATE_FAIL,
  TASK_DELETE_REQUEST,
  TASK_DELETE_SUCCESS,
  TASK_DELETE_FAIL,
} from '../constants/taskConstants';

export const listTasks = (projectId) => async (dispatch, getState) => {
  try {
    dispatch({ type: TASK_LIST_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
      params: { project: projectId },
    };
    const { data } = await axios.get('/api/tasks', config);
    dispatch({ type: TASK_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: TASK_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createTask = (taskData) => async (dispatch, getState) => {
  try {
    dispatch({ type: TASK_CREATE_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post('/api/tasks', taskData, config);
    dispatch({ type: TASK_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: TASK_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateTask = (taskId, updateData) => async (dispatch, getState) => {
  try {
    dispatch({ type: TASK_UPDATE_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put(`/api/tasks/${taskId}`, updateData, config);
    dispatch({ type: TASK_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: TASK_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteTask = (taskId) => async (dispatch, getState) => {
  try {
    dispatch({ type: TASK_DELETE_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.delete(`/api/tasks/${taskId}`, config);
    dispatch({ type: TASK_DELETE_SUCCESS, payload: taskId });
  } catch (error) {
    dispatch({
      type: TASK_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
