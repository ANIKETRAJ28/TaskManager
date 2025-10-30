import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export function Auth() {
  const path = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (path.pathname === "/auth" || path.pathname === "/auth/") {
      navigate("/auth/register");
    }
  }, [navigate, path.pathname]);
  return (
    <div className="h-[90vh] flex flex-col justify-center items-center">
      <Outlet />
    </div>
  );
}
