import axiosInstance from "../utils/api";
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

export const listRoles = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ROLE_LIST_REQUEST });
    const { user: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axiosInstance.get("/roles", config);
    dispatch({ type: ROLE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ROLE_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createRole = (roleData) => async (dispatch, getState) => {
  try {
    dispatch({ type: ROLE_CREATE_REQUEST });
    const { user: { userInfo } } = getState();
    const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axiosInstance.post("/roles", roleData, config);
    dispatch({ type: ROLE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ROLE_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateRole = (id, roleData) => async (dispatch, getState) => {
  try {
    dispatch({ type: ROLE_UPDATE_REQUEST });
    const { user: { userInfo } } = getState();
    const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axiosInstance.put(`/roles/${id}`, roleData, config);
    dispatch({ type: ROLE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ROLE_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteRole = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ROLE_DELETE_REQUEST });
    const { user: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    await axiosInstance.delete(`/roles/${id}`, config);
    dispatch({ type: ROLE_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: ROLE_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};