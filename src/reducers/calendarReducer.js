import {
    CALENDAR_LIST_REQUEST,
    CALENDAR_LIST_SUCCESS,
    CALENDAR_LIST_FAIL,
    CALENDAR_CREATE_REQUEST,
    CALENDAR_CREATE_SUCCESS,
    CALENDAR_CREATE_FAIL,
    CALENDAR_UPDATE_REQUEST,
    CALENDAR_UPDATE_SUCCESS,
    CALENDAR_UPDATE_FAIL,
    CALENDAR_DELETE_REQUEST,
    CALENDAR_DELETE_SUCCESS,
    CALENDAR_DELETE_FAIL,
  } from "../constants/calendarConstants";
  
  const initialState = {
    events: [],
    loading: false,
    error: null,
  };
  
  export const calendarReducer = (state = initialState, action) => {
    switch (action.type) {
      case CALENDAR_LIST_REQUEST:
      case CALENDAR_CREATE_REQUEST:
      case CALENDAR_UPDATE_REQUEST:
      case CALENDAR_DELETE_REQUEST:
        return { ...state, loading: true };
      case CALENDAR_LIST_SUCCESS:
        return { ...state, loading: false, events: action.payload };
      case CALENDAR_CREATE_SUCCESS:
        return { ...state, loading: false, events: [...state.events, action.payload] };
      case CALENDAR_UPDATE_SUCCESS:
        return {
          ...state,
          loading: false,
          events: state.events.map((event) =>
            event._id === action.payload._id ? action.payload : event
          ),
        };
      case CALENDAR_DELETE_SUCCESS:
        return {
          ...state,
          loading: false,
          events: state.events.filter((event) => event._id !== action.payload),
        };
      case CALENDAR_LIST_FAIL:
      case CALENDAR_CREATE_FAIL:
      case CALENDAR_UPDATE_FAIL:
      case CALENDAR_DELETE_FAIL:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  