import axios from "axios";
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

// List calendar events for the logged-in user
export const listCalendarEvents = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CALENDAR_LIST_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };
    const { data } = await axios.get("/api/calendar", config);
    dispatch({ type: CALENDAR_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CALENDAR_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Create a new calendar event
export const createCalendarEvent = (eventData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CALENDAR_CREATE_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` },
    };
    const { data } = await axios.post("/api/calendar", eventData, config);
    dispatch({ type: CALENDAR_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CALENDAR_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update an existing calendar event
export const updateCalendarEvent = (id, eventData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CALENDAR_UPDATE_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` },
    };
    const { data } = await axios.put(`/api/calendar/${id}`, eventData, config);
    dispatch({ type: CALENDAR_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CALENDAR_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete a calendar event
export const deleteCalendarEvent = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CALENDAR_DELETE_REQUEST });
    const {
      user: { userInfo },
    } = getState();
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };
    await axios.delete(`/api/calendar/${id}`, config);
    dispatch({ type: CALENDAR_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: CALENDAR_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
