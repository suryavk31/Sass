import { useSelector } from 'react-redux';

/**
 * Custom hook to cleanly compute access control dynamically on the frontend.
 * Evaluates the user's current workspace permissions returned actively by the backend.
 * 
 * Usage:
 * const { hasPermission, permissions } = usePermissions();
 * if (hasPermission('hr', 'delete')) { // render delete button }
 */
export const usePermissions = () => {
    // Current permissions are embedded inside the active userInfo payload in state
    const { userInfo } = useSelector((state) => state.user || {});

    // Ensure permissions object exists
    const permissions = userInfo?.permissions || {};

    const hasPermission = (moduleName, action) => {
        // Super Admin and Workspace Admins always have full access
        const roleNormalized = userInfo?.role?.toLowerCase();
        if (roleNormalized === 'super admin' || roleNormalized === 'admin') return true;

        const normalizedModule = moduleName.toLowerCase();

        // Safety check if module doesn't exist in user's permissions
        if (!permissions[normalizedModule]) return false;

        // Check explicit boolean action (view, create, edit, delete)
        return permissions[normalizedModule][action] === true;
    };

    return { permissions, hasPermission };
};

export default usePermissions;
