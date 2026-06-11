import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import SignupForm from './Signup';
import PickupTable from './Pickup';
import MaterialTable from './Material';
import PaymentForm from './Payment';
import Rewards from './Reward';
import Teaser from './Teaser';
import Feedback from './Feedback';
import Dashboard from './Dashboard';
import LoginScreen from './Login';
import Sidebar from './shared-component/SideBar';
import Settings from './Settings';

function AppContent() {
  const location = useLocation();

  const noSidebarRoutes = ['/login', '/signup', '/teaser'];
  const hideSidebar = noSidebarRoutes.includes(location.pathname);

  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* SIDEBAR */}
      {!hideSidebar && (
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      )}

      {/* MAIN CONTENT */}
      <div
        className="main-content"
      >
        <Routes>
          <Route path="/" element={<Navigate to="/teaser" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/material" element={<MaterialTable />} />
          <Route path="/pickup" element={<PickupTable />} />
          <Route path="/payments" element={<PaymentForm />} />
          <Route path="/reward" element={<Rewards />} />
          <Route path="/teaser" element={<Teaser />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return <AppContent />;
}