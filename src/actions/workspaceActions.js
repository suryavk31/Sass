// src/redux/actions/workspaceActions.js
import axios from 'axios';
import {
  WORKSPACE_LIST_REQUEST,
  WORKSPACE_LIST_SUCCESS,
  WORKSPACE_LIST_FAIL,
  WORKSPACE_CREATE_REQUEST,
  WORKSPACE_CREATE_SUCCESS,
  WORKSPACE_CREATE_FAIL,
} from '../constants/workspaceConstants';

export const listWorkspaces = () => async (dispatch, getState) => {
  try {
    dispatch({ type: WORKSPACE_LIST_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };
    const { data } = await axios.get('/api/workspaces', config);
    dispatch({ type: WORKSPACE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: WORKSPACE_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createWorkspace = (name) => async (dispatch, getState) => {
  try {
    dispatch({ type: WORKSPACE_CREATE_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post('/api/workspaces', { name }, config);
    dispatch({ type: WORKSPACE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: WORKSPACE_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
