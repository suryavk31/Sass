import {
    DASHBOARD_STATS_REQUEST,
    DASHBOARD_STATS_SUCCESS,
    DASHBOARD_STATS_FAIL,
} from '../constants/statsConstants';

export const statsReducer = (state = { stats: {} }, action) => {
    switch (action.type) {
        case DASHBOARD_STATS_REQUEST:
            return { loading: true, stats: {} };
        case DASHBOARD_STATS_SUCCESS:
            return { loading: false, stats: action.payload };
        case DASHBOARD_STATS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
