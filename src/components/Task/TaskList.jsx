// src/components/Task/TaskList.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listTasks, createTask, deleteTask } from '../../actions/taskActions';
import Button from '../ui/Button';
import Input from '../ui/Input';

const TaskList = ({ projectId }) => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.task);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    if (projectId) {
      dispatch(listTasks(projectId));
    }
  }, [dispatch, projectId]);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      dispatch(createTask({ title: newTaskTitle, project: projectId }));
      setNewTaskTitle('');
    }
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Tasks</h2>
      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4 flex">
        <Input
          id="newTask"
          name="newTask"
          type="text"
          placeholder="New task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="mr-2"
        />
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="border p-2 rounded mb-2 flex justify-between items-center">
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-600">{task.status}</p>
            </div>
            <Button onClick={() => handleDeleteTask(task._id)} className="bg-red-500 hover:bg-red-600">
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
