import axios from "axios";
import {
  PROJECT_LIST_REQUEST,
  PROJECT_LIST_SUCCESS,
  PROJECT_LIST_FAIL,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_CREATE_FAIL,
} from "../constants/projectConstants";

export const listProjects = (workspaceId) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROJECT_LIST_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
      params: { workspace: workspaceId },
    };
    const { data } = await axios.get("/api/projects", config);
    dispatch({ type: PROJECT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROJECT_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createProject = (name, workspace) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROJECT_CREATE_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` },
    };
    const { data } = await axios.post("/api/projects/create", { name, workspace }, config);
    dispatch({ type: PROJECT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROJECT_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
