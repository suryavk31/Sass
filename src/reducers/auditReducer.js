import {
    AUDIT_LIST_REQUEST,
    AUDIT_LIST_SUCCESS,
    AUDIT_LIST_FAIL,
} from '../constants/auditConstants';

export const auditListReducer = (state = { logs: [] }, action) => {
    switch (action.type) {
        case AUDIT_LIST_REQUEST:
            return { loading: true, logs: [] };
        case AUDIT_LIST_SUCCESS:
            return {
                loading: false,
                logs: action.payload.logs,
                pages: action.payload.pages,
                page: action.payload.page,
                total: action.payload.total,
            };
        case AUDIT_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
