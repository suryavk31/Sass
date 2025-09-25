import {
    PROJECT_LIST_REQUEST,
    PROJECT_LIST_SUCCESS,
    PROJECT_LIST_FAIL,
    PROJECT_CREATE_REQUEST,
    PROJECT_CREATE_SUCCESS,
    PROJECT_CREATE_FAIL,
  } from "../constants/projectConstants";
  
  const initialState = {
    projects: [],
    loading: false,
    error: null,
  };
  
  export const projectReducer = (state = initialState, action) => {
    switch (action.type) {
      case PROJECT_LIST_REQUEST:
      case PROJECT_CREATE_REQUEST:
        return { ...state, loading: true };
      case PROJECT_LIST_SUCCESS:
        return { ...state, loading: false, projects: action.payload };
      case PROJECT_CREATE_SUCCESS:
        return { ...state, loading: false, projects: [...state.projects, action.payload] };
      case PROJECT_LIST_FAIL:
      case PROJECT_CREATE_FAIL:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  