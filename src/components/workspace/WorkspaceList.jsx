// src/components/Workspace/WorkspaceList.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listWorkspaces, createWorkspace } from '../../actions/workspaceActions';
import Button from '../ui/Button';
import Input from '../ui/Input';

const WorkspaceList = () => {
  const dispatch = useDispatch();
  const { workspaces, loading, error } = useSelector((state) => state.workspace);
  const [workspaceName, setWorkspaceName] = useState('');

  useEffect(() => {
    dispatch(listWorkspaces());
  }, [dispatch]);

  const handleCreate = () => {
    if (workspaceName.trim()) {
      dispatch(createWorkspace(workspaceName));
      setWorkspaceName('');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Workspaces</h2>
      {loading && <p>Loading workspaces...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4 flex items-center">
        <Input
          id="workspaceName"
          name="workspaceName"
          type="text"
          placeholder="New workspace name"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          className="mr-2"
        />
        <Button onClick={handleCreate}>Create</Button>
      </div>
      <ul>
        {workspaces.map((ws) => (
          <li key={ws._id} className="border p-2 rounded mb-2">
            {ws.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkspaceList;
