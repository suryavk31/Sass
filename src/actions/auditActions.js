import api from '../utils/axiosInstance';
import {
    AUDIT_LIST_REQUEST,
    AUDIT_LIST_SUCCESS,
    AUDIT_LIST_FAIL,
} from '../constants/auditConstants';

export const listAuditLogs = (workspaceId, page = 1) => async (dispatch) => {
    try {
        dispatch({ type: AUDIT_LIST_REQUEST });

        // axiosInstance handles the Authorization header automatically
        const { data } = await api.get(`/api/audit-logs?workspaceId=${workspaceId}&page=${page}`);

        dispatch({
            type: AUDIT_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: AUDIT_LIST_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

