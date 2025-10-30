import { AuthCard } from "@/components/AuthCard";
import { useAppSelector } from "@/hook";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <AuthCard
      title="Welcome Back"
      navigateTo="register"
    />
  );
}
