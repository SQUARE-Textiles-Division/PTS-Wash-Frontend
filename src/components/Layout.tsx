import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import useAuth from "../hooks/useAuth";

function Layout() {
  const location = useLocation();
  const {auth}=useAuth()
  return (
    <>
      {location.pathname !== "/login" && <Navbar allowedRoles={auth?.roles} />}
      <Outlet />
    </>
  );
}

export default Layout;