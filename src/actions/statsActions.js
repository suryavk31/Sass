// src/actions/statsActions.js
import api from '../utils/axiosInstance';
import {
    DASHBOARD_STATS_REQUEST,
    DASHBOARD_STATS_SUCCESS,
    DASHBOARD_STATS_FAIL,
} from '../constants/statsConstants';

export const getDashboardStats = () => async (dispatch) => {
    try {
        dispatch({ type: DASHBOARD_STATS_REQUEST });
        const { data } = await api.get('/api/stats');
        dispatch({ type: DASHBOARD_STATS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: DASHBOARD_STATS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};
