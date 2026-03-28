// src/actions/projectActions.js
import api from '../utils/axiosInstance';
import {
  PROJECT_LIST_REQUEST,
  PROJECT_LIST_SUCCESS,
  PROJECT_LIST_FAIL,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_CREATE_FAIL,
} from '../constants/projectConstants';

export const listProjects = (workspaceId) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_LIST_REQUEST });
    const { data } = await api.get('/api/projects', { params: { workspace: workspaceId } });
    dispatch({ type: PROJECT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROJECT_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createProject = (name, workspace) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_CREATE_REQUEST });
    const { data } = await api.post('/api/projects/create', { name, workspace });
    dispatch({ type: PROJECT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROJECT_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
