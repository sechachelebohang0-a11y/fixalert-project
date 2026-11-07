import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './AuthContext';

import ReporterLayout from './components/ReporterLayout';
import StaffLayout from './components/StaffLayout';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ReportProblem from './pages/ReportProblem';
import ReportSubmitted from './pages/ReportSubmitted';
import MyReports from './pages/MyReports';
import Notifications from './pages/Notifications';
import StaffDashboard from './pages/StaffDashboard';
import StaffReports from './pages/StaffReports';
import Profile from './pages/Profile';

function RequireRole({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    return <Navigate to={user.role === 'reporter' ? '/home' : '/staff'} replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="screen">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/staff-login" element={<Login staff />} />
            <Route path="/signup" element={<Signup />} />
            

            <Route
              element={
                <RequireRole roles={['reporter']}>
                  <ReporterLayout />
                </RequireRole>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/report/:type" element={<ReportProblem />} />
              <Route path="/report-submitted" element={<ReportSubmitted />} />
              <Route path="/my-reports" element={<MyReports />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile fallback="/home" />} />
            </Route>

            <Route
              element={
                <RequireRole roles={['staff', 'admin']}>
                  <StaffLayout />
                </RequireRole>
              }
            >
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/staff/reports" element={<StaffReports />} />
              <Route path="/staff/profile" element={<Profile fallback="/staff" />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;  