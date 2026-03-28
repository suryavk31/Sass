// src/actions/calendarActions.js
import api from '../utils/axiosInstance';
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
} from '../constants/calendarConstants';

export const listCalendarEvents = (workspaceId) => async (dispatch) => {
  try {
    dispatch({ type: CALENDAR_LIST_REQUEST });
    const { data } = await api.get(`/api/calendar?workspaceId=${workspaceId}`);
    dispatch({ type: CALENDAR_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CALENDAR_LIST_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const createCalendarEvent = (eventData) => async (dispatch) => {
  try {
    dispatch({ type: CALENDAR_CREATE_REQUEST });
    const { data } = await api.post('/api/calendar', eventData);
    dispatch({ type: CALENDAR_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CALENDAR_CREATE_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const updateCalendarEvent = (id, eventData) => async (dispatch) => {
  try {
    dispatch({ type: CALENDAR_UPDATE_REQUEST });
    const { data } = await api.put(`/api/calendar/${id}`, eventData);
    dispatch({ type: CALENDAR_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CALENDAR_UPDATE_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const deleteCalendarEvent = (id) => async (dispatch) => {
  try {
    dispatch({ type: CALENDAR_DELETE_REQUEST });
    await api.delete(`/api/calendar/${id}`);
    dispatch({ type: CALENDAR_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: CALENDAR_DELETE_FAIL, payload: error.response?.data?.message || error.message });
  }
};
