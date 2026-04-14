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
import NotificationsPage from "./pages/NotificationsPage";
import LeadsPage from "./pages/LeadsPage";
import DeveloperGuide from "./pages/DeveloperGuide";
import CRMPage from "./pages/CRMPage";
import DashboardsPage from "./pages/DashboardsPage";
import SalesDashboard from "./pages/SalesDashboard";
import SalesReportsPage from "./pages/reports/SalesReportsPage";
import EmployeeReportsPage from "./pages/reports/EmployeeReportsPage";
import LeadReportsPage from "./pages/reports/LeadReportsPage";
import ProjectReportsPage from "./pages/reports/ProjectReportsPage";
import SalesPipelinePage from "./pages/SalesPipelinePage";
import AttendancePage from "./pages/AttendancePage";
import SalaryCalculationPage from "./pages/SalaryCalculationPage";
import InvoicePage from "./pages/InvoicePage";
import LeaveAndExpensePage from "./pages/LeaveAndExpensePage";
import HRDashboardPage from "./pages/HRDashboardPage";
import ContactsPage from "./pages/ContactsPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import InvitePage from "./pages/InvitePage";
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
        <Route path="/invite/:token" element={<InvitePage />} />

        {/* Nested routes under the dashboard layouts */}
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
          <Route path="roles" element={<PrivateRoute requiredModule="workspace"><RolesPage /></PrivateRoute>} />
          <Route path="employee" element={<PrivateRoute requiredModule="hr"><EmployeePage /></PrivateRoute>} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="projects" element={<PrivateRoute requiredModule="projects"><ProjectPage /></PrivateRoute>} />
          <Route path="projects/:projectId" element={<PrivateRoute requiredModule="projects"><ProjectDetailPage /></PrivateRoute>} />
          <Route path="workspaces" element={<PrivateRoute requiredModule="workspace"><WorkspacePage /></PrivateRoute>} />
          <Route path="audit-logs" element={<PrivateRoute requiredModule="workspace"><AuditLogsPage /></PrivateRoute>} />
          <Route path="developer-settings" element={<DeveloperSettings />} />
          <Route path="automations" element={<AutomationsPage />} />
          <Route path="attendance" element={<PrivateRoute requiredModule="hr"><AttendancePage /></PrivateRoute>} />
          <Route path="salary" element={<PrivateRoute requiredModule="hr"><SalaryCalculationPage /></PrivateRoute>} />
          <Route path="invoices" element={<PrivateRoute requiredModule="sales"><InvoicePage /></PrivateRoute>} />
          <Route path="leave-expenses" element={<PrivateRoute requiredModule="hr"><LeaveAndExpensePage /></PrivateRoute>} />
          <Route path="hr-dashboard" element={<PrivateRoute requiredModule="hr"><HRDashboardPage /></PrivateRoute>} />

          {/* Placeholder Routes for sidebars */}
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="spaces" element={<ProjectPage />} />
          <Route path="dashboards" element={<DashboardsPage />} />

          {/* Reports Routes */}
          <Route path="reports/sales" element={<SalesReportsPage />} />
          <Route path="reports/employee" element={<EmployeeReportsPage />} />
          <Route path="reports/leads" element={<LeadReportsPage />} />
          <Route path="reports/project" element={<ProjectReportsPage />} />

          <Route path="crm" element={<PrivateRoute requiredModule="sales"><CRMPage /></PrivateRoute>} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="leads" element={<PrivateRoute requiredModule="sales"><LeadsPage /></PrivateRoute>} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="pipeline" element={<PrivateRoute requiredModule="sales"><SalesPipelinePage /></PrivateRoute>} />
          <Route path="sales-dashboard" element={<PrivateRoute requiredModule="sales"><SalesDashboard /></PrivateRoute>} />

          {/* Additional child routes */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
