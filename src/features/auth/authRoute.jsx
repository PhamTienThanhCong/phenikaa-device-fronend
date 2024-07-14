import { useAppSelector } from "@/app/hooks";
import useLoadData from "@/hooks/useLoadData";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AuthRoute() {
  const loading = useLoadData();
  const isAuthenticated = useAppSelector((store) => store.auth.isLogin);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={location} />;
}

export default AuthRoute;
