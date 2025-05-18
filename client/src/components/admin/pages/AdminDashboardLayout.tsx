import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../dashboard/AdminSlidebar';
import Navbar from '../dashboard/Navbar';

const AdminDashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="sticky top-0 h-screen">
        <AdminSidebar />
      </div>
      <div className="flex-1">
        <div className="sticky top-0 z-10">
          <Navbar />
        </div>
        <main className="p-6">
          {/* Optionally, show AdminSummary here for all admin pages */}
          {/* <AdminSummary /> */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
