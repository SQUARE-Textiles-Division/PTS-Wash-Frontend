import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
// import { ROLES } from "../Roles";
import { ROLES_ADD } from "../Roles";

// build map once (outside component in real project)
const ROLE_TO_ROUTE: Record<string, string> = {};

Object.keys(ROLES_ADD).forEach((key) => {
  const item = ROLES_ADD[key as keyof typeof ROLES_ADD];

  if ("route" in item) {
    ROLE_TO_ROUTE[item.role] = item.route;
  } else {
    Object.values(item).forEach((sub: any) => {
      if (sub.role && sub.route) {
        ROLE_TO_ROUTE[sub.role] = sub.route;
      }
    });
  }
});

const RoleBasedHome = () => {
  const { auth } = useAuth();

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = auth?.roles || [];

  // find first matching route
  const redirectRoute = userRoles
    .map((r: string) => ROLE_TO_ROUTE[r])
    .find(Boolean);

  return (
    <Navigate
      to={redirectRoute || "/login"}
      replace
    />
  );
};

export default RoleBasedHome;