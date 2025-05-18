import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import Login from "./pages/Login";
import AdminDashboard from "./components/admin/pages/AdminDahsboard";
import EmployeeDashBoard from "./components/employee/EmployeeDashBoard";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminSummary from "./components/admin/dashboard/AdminSummary";
import Department from "./components/admin/departments/Department";
import AddDepartment from "./components/admin/departments/AddDepartment";
import EditDepartment from "./components/admin/departments/EditDepartment";
import EmployeeList from "./components/employee/employeelist";
import AddEmployee from "./components/employee/Addemployee";
import EditEmployee from "./components/employee/EditEmployee";
import AddSalary from "./components/admin/salary/AddSalary";
import ViewSalary from "./components/admin/salary/ViewSalary";
import SalaryHistory from "./components/admin/salary/SalaryHistory";
import ViewEmployee from "./components/employee/ViewEmployee";
import EmployeeDashboardLayout from './components/employee/EmployeeDashboardLayout';
import EmployeeDashboard from './components/employee/EmployeeDashBoard';
import EmployeeProfile from './components/employee/EmployeeProfile';
import EmployeeLeave from './components/employee/EmployeeLeave';
import EmployeeAttendance from './components/employee/EmployeeAttendance';
import EmployeeSettings from './components/employee/EmployeeSettings';
import EmployeeSalary from './components/employee/EmployeeSalary';
import AdminLeaveManagement from "./components/admin/leave/AdminLeaveManagement";
import AdminAttendance from "./components/admin/pages/AdminAttendance";
import AttendanceReport from "./components/admin/AttendanceReport";
import AdminSettings from "./components/admin/pages/AdminSettings";

function App() {
  const { user } = useAuth();

  // Redirect based on user role
  const getInitialRedirect = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin-dashboard';
    return '/employee-dashboard';
  };

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={
        user ? (
          <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard'} />
        ) : (
          <Login />
        )
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={getInitialRedirect()} />} />

      {/* Admin Routes */}
      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      }>
        <Route index element={<AdminSummary />} />
        <Route path="departments">
          <Route index element={<Department />} />
          <Route path="add" element={<AddDepartment />} />
          <Route path="edit/:id" element={<EditDepartment />} />
        </Route>
        <Route path="employee">
          <Route index element={<EmployeeList />} />
          <Route path="add" element={<AddEmployee />} />
          <Route path="edit/:id" element={<EditEmployee />} />
          <Route path="view/:id" element={<ViewEmployee />} />
          <Route path="salary/:id" element={<SalaryHistory />} />
        </Route>
        <Route path="salary">
          <Route index element={<SalaryHistory />} />
          <Route path="add" element={<AddSalary />} />
          <Route path=":id" element={<ViewSalary />} />
        </Route>
        <Route path="leave-management" element={<AdminLeaveManagement />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="attendance-report" element={<AttendanceReport />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="leaves" element={<Navigate to="/admin-dashboard/leave-management" replace />} />
        <Route path="add-employee" element={<Navigate to="/admin-dashboard/employee/add" replace />} />
        <Route path="add-departments" element={<Navigate to="/admin-dashboard/departments/add" replace />} />
        <Route path="add-salary" element={<Navigate to="/admin-dashboard/salary/add" replace />} />
      </Route>

      {/* Employee Routes */}
      <Route path="/employee-dashboard" element={
        <ProtectedRoute allowedRole="employee">
          <EmployeeDashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<EmployeeDashboard />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="leave" element={<EmployeeLeave />} />
        <Route path="salary" element={<EmployeeSalary />} />
        <Route path="add-salary" element={<AddSalary />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
        <Route path="settings" element={<EmployeeSettings />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={
        <Navigate to={getInitialRedirect()} replace />
      } />
    </Routes>
  );
}

export default App;
