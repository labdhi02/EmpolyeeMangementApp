import { useAuth } from '../../context/authContext'
import EmployeeSidebar from '../EmployeeDashboard/EmployeeSidebar'
import EmployeeNavbar from '../EmployeeDashboard/EmployeeNavbar'
import { Outlet } from 'react-router-dom';

const EmployeeDashboardLayout = () => {
  // The authentication check is now handled by ProtectedRoute wrapper in App.tsx
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="sticky top-0 h-screen">
        <EmployeeSidebar />
      </div>
      <div className="flex-1">
        <div className="sticky top-0 z-10">
          <EmployeeNavbar />
        </div>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default EmployeeDashboardLayout;
