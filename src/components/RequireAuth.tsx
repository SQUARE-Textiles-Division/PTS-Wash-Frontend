import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ROLES, { ROLES_ADD } from "../Roles";
// import { all } from "axios";

// Build reverse map ONCE (outside component)
const getRoleKeyByValue = (value: string) => {
  return Object.keys(ROLES).find(
    (key) => ROLES[key as keyof typeof ROLES] === value
  ) as keyof typeof ROLES | undefined;
};

const RequireAuth = ({ allowedRoles }: any) => {
  const { auth } = useAuth();
  const location = useLocation();
  console.log(auth.accessToken,' Token  here')
  // ---------------------
  // 1. NOT LOGGED IN
  // ---------------------
  if (!auth?.accessToken) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // ---------------------
  // 2. ROLE NOT ALLOWED
  // ---------------------
    const userRoles = auth?.roles;
    console.log(userRoles)
    const isAllowed = userRoles.some((role) =>
      allowedRoles.includes(role)
    );

  console.log(allowedRoles,' ',userRoles)
  if (!isAllowed) {
    const roleKey = getRoleKeyByValue(userRoles);

    const fallbackRoute =
      roleKey 
        ? ROLES_ADD[roleKey].route
        : "/login";

    return <Navigate to={fallbackRoute} replace />;
  }

  // ---------------------
  // 3. ALLOWED
  // ---------------------
  return <Outlet />;
};

export default RequireAuth;