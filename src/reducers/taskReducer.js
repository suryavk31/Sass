// src/redux/reducers/taskReducer.js
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
  
  const initialState = {
    tasks: [],
    loading: false,
    error: null,
  };
  
  export const taskReducer = (state = initialState, action) => {
    switch (action.type) {
      case TASK_LIST_REQUEST:
      case TASK_CREATE_REQUEST:
      case TASK_UPDATE_REQUEST:
      case TASK_DELETE_REQUEST:
        return { ...state, loading: true };
      case TASK_LIST_SUCCESS:
        return { ...state, loading: false, tasks: action.payload };
      case TASK_CREATE_SUCCESS:
        return { ...state, loading: false, tasks: [...state.tasks, action.payload] };
      case TASK_UPDATE_SUCCESS:
        return {
          ...state,
          loading: false,
          tasks: state.tasks.map((task) => {
            const taskId = task._id || task.id;
            const payloadId = action.payload._id || action.payload.id;
            return (taskId && payloadId && taskId === payloadId) ? action.payload : task;
          }),
        };
      case TASK_DELETE_SUCCESS:
        return {
          ...state,
          loading: false,
          tasks: state.tasks.filter((task) => (task._id !== action.payload && task.id !== action.payload)),
        };
      case TASK_LIST_FAIL:
      case TASK_CREATE_FAIL:
      case TASK_UPDATE_FAIL:
      case TASK_DELETE_FAIL:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  