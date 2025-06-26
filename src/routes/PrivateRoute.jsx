import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // No autenticado
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // No autorizado por rol
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
