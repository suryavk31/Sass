// src/actions/taskActions.js
import api from '../utils/axiosInstance';
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

export const listTasks = (projectId, parentId = null) => async (dispatch) => {
  try {
    dispatch({ type: TASK_LIST_REQUEST });
    const params = { project: projectId, all: 'true' };
    if (parentId) params.parentId = parentId;
    
    const { data } = await api.get('/api/tasks', { params });
    dispatch({ type: TASK_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TASK_LIST_FAIL, payload: error.response?.data?.message || error.message });
  }
};


export const createTask = (taskData) => async (dispatch) => {
  try {
    dispatch({ type: TASK_CREATE_REQUEST });
    const { data } = await api.post('/api/tasks', taskData);
    dispatch({ type: TASK_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TASK_CREATE_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const updateTask = (taskId, updateData) => async (dispatch) => {
  try {
    dispatch({ type: TASK_UPDATE_REQUEST });
    const { data } = await api.put(`/api/tasks/${taskId}`, updateData);
    dispatch({ type: TASK_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TASK_UPDATE_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const deleteTask = (taskId) => async (dispatch) => {
  try {
    dispatch({ type: TASK_DELETE_REQUEST });
    await api.delete(`/api/tasks/${taskId}`);
    dispatch({ type: TASK_DELETE_SUCCESS, payload: taskId });
  } catch (error) {
    dispatch({ type: TASK_DELETE_FAIL, payload: error.response?.data?.message || error.message });
  }
};
