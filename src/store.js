import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { authReducer } from './reducers/authReducer';
import { projectReducer } from './reducers/projectReducer';
import { workspaceReducer } from './reducers/workspaceReducer';
import { taskReducer } from './reducers/taskReducer';
import { calendarReducer } from "./reducers/calendarReducer";
import { employeeReducer } from "./reducers/employeeReducer";
import { roleReducer } from './reducers/roleReducer';

const reducer = combineReducers({
  user: authReducer,
  project: projectReducer,
  workspace: workspaceReducer,
  task: taskReducer,
  calendar: calendarReducer,
  employee: employeeReducer,
  role: roleReducer,
});

const middleware = [thunk];

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;