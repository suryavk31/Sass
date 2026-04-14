// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BlockRounded } from '@mui/icons-material';
import usePermissions from '../hooks/usePermissions';

const PrivateRoute = ({ children, requiredModule, requiredAction = 'view' }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const { hasPermission } = usePermissions();

  if (!isAuthenticated) return <Navigate to="/log-in" />;

  // Dynamic Multi-Tenant RBAC Validation
  if (requiredModule && !hasPermission(requiredModule, requiredAction)) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 p-6">
           <div className="bg-white rounded-[32px] p-10 text-center shadow-[0_24px_50px_rgba(0,0,0,0.06)] border border-slate-100 max-w-sm w-full">
              <div className="w-16 h-16 bg-red-50 text-red-500 flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-md shadow-red-500/10">
                  <BlockRounded sx={{ fontSize: 32 }} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Access Denied</h2>
              <p className="text-slate-500 font-medium text-[13px] leading-relaxed mb-6">
                You do not possess the required module permissions (<span className="font-bold">{requiredModule}</span>) to view this page. Contact your workspace administrator for access.
              </p>
           </div>
        </div>
      );
  }

  return children;
};

export default PrivateRoute;
