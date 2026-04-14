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

export const listRoles = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ROLE_LIST_REQUEST });
    const state = getState();
    const { workspace: { workspaces } } = state;
    const activeWorkspace = workspaces?.[0] || {};

    // Multi-source workspaceId resolution - avoid sending undefined
    const workspaceId = activeWorkspace.id 
      || activeWorkspace._id 
      || state.user?.userInfo?.workspaceId;

    // Guard: do not fire the request if workspaceId is still not resolved
    if (!workspaceId || workspaceId === 'undefined') {
      dispatch({ type: ROLE_LIST_FAIL, payload: 'Workspace not loaded yet' });
      return;
    }

    const { data } = await api.get(`/api/roles?workspaceId=${workspaceId}`);
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
    throw error;
  }
};

export const updateRole = (id, roleData) => async (dispatch) => {
  try {
    dispatch({ type: ROLE_UPDATE_REQUEST });
    const { data } = await api.put(`/api/roles/${id}`, roleData);
    dispatch({ type: ROLE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ROLE_UPDATE_FAIL, payload: error.response?.data?.message || error.message });
    throw error;
  }
};

export const deleteRole = (id) => async (dispatch) => {
  try {
    dispatch({ type: ROLE_DELETE_REQUEST });
    await api.delete(`/api/roles/${id}`);
    dispatch({ type: ROLE_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: ROLE_DELETE_FAIL, payload: error.response?.data?.message || error.message });
    throw error;
  }
};

// ─── Role Templates ──────────────────────────────────────────────────────────
export const fetchRoleTemplates = () => async (dispatch) => {
  try {
    const { data } = await api.get('/api/role-templates');
    return data;
  } catch (error) {
    console.error('Failed to fetch role templates', error);
    return [];
  }
};