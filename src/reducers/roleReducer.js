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
  } from "../constants/roleConstants";
  
const initialState = {
    roles: [],
    loading: false,
    error: null,
  };
  
  export const roleReducer = (state = initialState, action) => {
    switch (action.type) {
      case ROLE_LIST_REQUEST:
      case ROLE_CREATE_REQUEST:
      case ROLE_UPDATE_REQUEST:
      case ROLE_DELETE_REQUEST:
        return { ...state, loading: true };
      case ROLE_LIST_SUCCESS:
        return { ...state, loading: false, roles: action.payload };
      case ROLE_CREATE_SUCCESS:
        return { ...state, loading: false, roles: [...state.roles, action.payload] };
      case ROLE_UPDATE_SUCCESS:
        return {
          ...state,
          loading: false,
          roles: state.roles.map((role) =>
            role.id === action.payload.id ? action.payload : role
          ),
        };
      case ROLE_DELETE_SUCCESS:
        return {
          ...state,
          loading: false,
          roles: state.roles.filter((role) => role.id !== action.payload),
        };
      case ROLE_LIST_FAIL:
      case ROLE_CREATE_FAIL:
      case ROLE_UPDATE_FAIL:
      case ROLE_DELETE_FAIL:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  