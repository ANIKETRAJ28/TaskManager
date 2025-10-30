import { AuthLayout } from "@/Layout/AuthLayout";
import { MainLayout } from "@/Layout/MainLayout";
import { Auth } from "@/Page/Auth/Auth";
import { Login } from "@/Page/Auth/Login";
import { SignUp } from "@/Page/Auth/Signup";
import DashBoard from "@/Page/DashBoard";
import { Landing } from "@/Page/Landing";
import { Routes, Route } from "react-router-dom";

export function MainRoute() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Landing />
          </MainLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <DashBoard />
          </MainLayout>
        }
      />
      <Route
        path="/auth"
        element={
          <AuthLayout>
            <Auth />
          </AuthLayout>
        }
      >
        <Route
          path="register"
          element={<SignUp />}
        />
        <Route
          path="login"
          element={<Login />}
        />
      </Route>
    </Routes>
  );
}
