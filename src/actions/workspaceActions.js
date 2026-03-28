// src/actions/workspaceActions.js
import api from '../utils/axiosInstance';
import {
  WORKSPACE_LIST_REQUEST,
  WORKSPACE_LIST_SUCCESS,
  WORKSPACE_LIST_FAIL,
  WORKSPACE_CREATE_REQUEST,
  WORKSPACE_CREATE_SUCCESS,
  WORKSPACE_CREATE_FAIL,
  WORKSPACE_USER_ROLE_REQUEST,
  WORKSPACE_USER_ROLE_SUCCESS,
  WORKSPACE_USER_ROLE_FAIL,
} from '../constants/workspaceConstants';

export const listWorkspaces = () => async (dispatch) => {
  try {
    dispatch({ type: WORKSPACE_LIST_REQUEST });
    const { data } = await api.get('/api/workspaces');
    dispatch({ type: WORKSPACE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: WORKSPACE_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createWorkspace = (name) => async (dispatch) => {
  try {
    dispatch({ type: WORKSPACE_CREATE_REQUEST });
    const { data } = await api.post('/api/workspaces', { name });
    dispatch({ type: WORKSPACE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: WORKSPACE_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getWorkspaceUserRole = (workspaceId) => async (dispatch) => {
  try {
    dispatch({ type: WORKSPACE_USER_ROLE_REQUEST });
    const { data } = await api.get(`/api/workspaces/user-role?workspaceId=${workspaceId}`);
    dispatch({ type: WORKSPACE_USER_ROLE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: WORKSPACE_USER_ROLE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
