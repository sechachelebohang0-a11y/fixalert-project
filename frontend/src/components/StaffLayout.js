import { NavLink, Outlet } from 'react-router-dom';
import Icon from './Icon';

export default function StaffLayout() {
  return (
    <>
      <Outlet />
      <nav className="bottom-nav" aria-label="Staff">
        <NavLink to="/staff" end><Icon name="grid" /><span>Dashboard</span></NavLink>
        <NavLink to="/staff/reports"><Icon name="clipboard" /><span>Reports</span></NavLink>
        <NavLink to="/staff/profile"><Icon name="user" /><span>Profile</span></NavLink>
      </nav>
    </>
  );
}