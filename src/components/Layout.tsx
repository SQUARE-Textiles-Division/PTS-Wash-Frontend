import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import useAuth from "../hooks/useAuth";

function Layout() {
  const location = useLocation();
  const {auth}=useAuth()

  console.log('Auhtorized for',auth?.roles)
  return (
    <>
      {location.pathname !== "/login" && <Navbar />}
      <Outlet />
    </>
  );
}

export default Layout;