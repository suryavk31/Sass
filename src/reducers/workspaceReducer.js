// src/redux/reducers/workspaceReducer.js
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
  
  const initialState = {
    workspaces: [],
    loading: false,
    error: null,
  };
  
  export const workspaceReducer = (state = initialState, action) => {
    switch (action.type) {
      case WORKSPACE_LIST_REQUEST:
      case WORKSPACE_CREATE_REQUEST:
        return { ...state, loading: true };
      case WORKSPACE_LIST_SUCCESS:
        return { ...state, loading: false, workspaces: action.payload };
      case WORKSPACE_CREATE_SUCCESS:
      return { ...state, loading: false, workspaces: [...state.workspaces, action.payload] };
    case WORKSPACE_USER_ROLE_REQUEST:
      return { ...state, loadingRole: true };
    case WORKSPACE_USER_ROLE_SUCCESS:
      return { ...state, loadingRole: false, userRole: action.payload };
    case WORKSPACE_LIST_FAIL:
    case WORKSPACE_CREATE_FAIL:
    case WORKSPACE_USER_ROLE_FAIL:
      return { ...state, loading: false, loadingRole: false, error: action.payload };
    default:
      return state;
  }
};
  