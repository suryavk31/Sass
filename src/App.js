// src/App.js
import WebFont from "webfontloader";
import { Routes, Route, Navigate } from "react-router-dom";
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
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import DeveloperSettings from "./pages/DeveloperSettings";
import AutomationsPage from "./pages/AutomationsPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import LeadsPage from "./pages/LeadsPage";
import DeveloperGuide from "./pages/DeveloperGuide";
import CRMPage from "./pages/CRMPage";
import DashboardsPage from "./pages/DashboardsPage";
import SalesDashboard from "./pages/SalesDashboard";
import SalesPipelinePage from "./pages/SalesPipelinePage";
import AttendancePage from "./pages/AttendancePage";
import SalaryCalculationPage from "./pages/SalaryCalculationPage";
import InvoicePage from "./pages/InvoicePage";
import LeaveAndExpensePage from "./pages/LeaveAndExpensePage";
import ContactsPage from "./pages/ContactsPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import { Toaster } from 'react-hot-toast';

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
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={window.__TAURI_INTERNALS__ ? <Navigate to="/log-in" replace /> : <LandingPage />} />
        <Route path="/log-in" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/developer-guide" element={<DeveloperGuide />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-cancel" element={<PaymentCancelPage />} />

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
          <Route path="projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="workspaces" element={<WorkspacePage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="developer-settings" element={<DeveloperSettings />} />
          <Route path="automations" element={<AutomationsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="salary" element={<SalaryCalculationPage />} />
          <Route path="invoices" element={<InvoicePage />} />
          <Route path="leave-expenses" element={<LeaveAndExpensePage />} />
          
          {/* Placeholder Routes for sidebars */}
          <Route path="notifications" element={<ComingSoonPage title="Notifications Center" />} />
          <Route path="spaces" element={<ProjectPage />} />
          <Route path="dashboards" element={<DashboardsPage />} />
          <Route path="crm" element={<CRMPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="pipeline" element={<SalesPipelinePage />} />
          <Route path="sales-dashboard" element={<SalesDashboard />} />
          
          {/* Additional child routes */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
