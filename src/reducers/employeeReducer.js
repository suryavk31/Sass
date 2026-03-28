import {
    EMPLOYEE_LIST_REQUEST,
    EMPLOYEE_LIST_SUCCESS,
    EMPLOYEE_LIST_FAIL,
    EMPLOYEE_CREATE_REQUEST,
    EMPLOYEE_CREATE_SUCCESS,
    EMPLOYEE_CREATE_FAIL,
    EMPLOYEE_UPDATE_REQUEST,
    EMPLOYEE_UPDATE_SUCCESS,
    EMPLOYEE_UPDATE_FAIL,
    EMPLOYEE_DELETE_REQUEST,
    EMPLOYEE_DELETE_SUCCESS,
    EMPLOYEE_DELETE_FAIL,
    EMPLOYEE_ADD_TASK_RECORD_REQUEST,
    EMPLOYEE_ADD_TASK_RECORD_SUCCESS,
    EMPLOYEE_ADD_TASK_RECORD_FAIL,
  } from "../constants/employeeConstants";
  
  const initialState = {
    employees: [],
    loading: false,
    error: null,
  };
  
  export const employeeReducer = (state = initialState, action) => {
    switch (action.type) {
      case EMPLOYEE_LIST_REQUEST:
      case EMPLOYEE_CREATE_REQUEST:
      case EMPLOYEE_UPDATE_REQUEST:
      case EMPLOYEE_DELETE_REQUEST:
      case EMPLOYEE_ADD_TASK_RECORD_REQUEST:
        return { ...state, loading: true };
      case EMPLOYEE_LIST_SUCCESS:
        return { ...state, loading: false, employees: action.payload };
      case EMPLOYEE_CREATE_SUCCESS:
        return { ...state, loading: false, employees: [...state.employees, action.payload] };
      case EMPLOYEE_UPDATE_SUCCESS:
        return {
          ...state,
          loading: false,
          employees: state.employees.map((emp) => {
            const empId = emp._id || emp.id;
            const payloadId = action.payload._id || action.payload.id;
            return (empId === payloadId) ? action.payload : emp;
          }),
        };
      case EMPLOYEE_DELETE_SUCCESS:
        return {
          ...state,
          loading: false,
          employees: state.employees.filter((emp) => {
             const empId = emp._id || emp.id;
             return empId !== action.payload;
          }),
        };
      case EMPLOYEE_ADD_TASK_RECORD_SUCCESS:
        return { ...state, loading: false }; // Optionally update a specific employee record
      case EMPLOYEE_LIST_FAIL:
      case EMPLOYEE_CREATE_FAIL:
      case EMPLOYEE_UPDATE_FAIL:
      case EMPLOYEE_DELETE_FAIL:
      case EMPLOYEE_ADD_TASK_RECORD_FAIL:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  