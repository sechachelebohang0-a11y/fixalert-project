import { NavLink, Outlet } from 'react-router-dom';
import Icon from './Icon';

export default function ReporterLayout() {
  return (
    <>
      <Outlet />
      <nav className="bottom-nav" aria-label="Main">
        <NavLink to="/home"><Icon name="home" /><span>Home</span></NavLink>
        <NavLink to="/my-reports"><Icon name="clipboard" /><span>Reports</span></NavLink>
        <NavLink to="/notifications"><Icon name="bell" /><span>Alerts</span></NavLink>
        <NavLink to="/profile"><Icon name="user" /><span>Profile</span></NavLink>
      </nav>
    </>
  );
}