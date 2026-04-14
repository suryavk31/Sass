// src/components/DashboardLayout.jsx - Dual Sidebar ClickUp Layout
import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listWorkspaces } from '../actions/workspaceActions';
import { listProjects } from '../actions/projectActions';
import Sidebar from './dashboard/Sidebar';
import Header from './dashboard/Header';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  
  const { workspaces } = useSelector((state) => state.workspace);

  // Centralized Data Fetching
  useEffect(() => {
    dispatch(listWorkspaces());
  }, [dispatch]);

  useEffect(() => {
    if (workspaces && workspaces.length > 0) {
      // Default to the first workspace's projects to populate the sidebar
      const wsId = workspaces[0]._id || workspaces[0].id;
      dispatch(listProjects(wsId));
    }
  }, [dispatch, workspaces]);

  return (
    <div className="h-screen flex bg-[#f8fafc] overflow-hidden text-slate-900 font-sans">
      <Sidebar />

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white shadow-[inset_1px_0_0_0_rgba(0,0,0,0.05)] overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden bg-[#fafafa]">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

