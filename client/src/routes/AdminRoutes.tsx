import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import SalaryList from '../components/admin/salary/SalaryList';
import AddSalary from '../components/admin/salary/AddSalary';
import ViewSalary from '../components/admin/salary/ViewSalary';
import SalaryHistory from '../components/admin/salary/SalaryHistory';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* Salary routes */}
        <Route path="salary">
          <Route index element={<SalaryList />} />
          <Route path="add" element={<AddSalary />} />
          <Route path=":id" element={<ViewSalary />} />
          <Route path="history/:id" element={<SalaryHistory />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;