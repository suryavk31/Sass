// src/App.js
import WebFont from "webfontloader";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import WorkspacePage from "./pages/WorkspacePage";
import CalendarPage from "./pages/CalendarPage";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/DashboardLayout";
import EmployeePage from "./pages/EmployeePage";
import LandingPage from "./pages/LandingPage";
import RoleCreationPage from "./pages/RoleCreationPage";
import RolesPage from "./pages/RolesPage";

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto:300,400,500,600,700"],
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-violet-100 to-purple-300">
      <Routes>
      <Route path="/" element={<LandingPage />} />
        <Route path="/log-in" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Nested routes under the dashboard layout */}
        <Route
          path="/:userId"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-role" element={<RoleCreationPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="employee" element={<EmployeePage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="projects" element={<ProjectPage />} />
          <Route path="workspaces" element={<WorkspacePage />} />
          {/* Additional child routes */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
