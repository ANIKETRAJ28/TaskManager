import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hook";
import { logoutUser } from "@/Store/authSlice";
import { ListTodo, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function Layout({ children }: { children: React.ReactNode }) {
  const { username } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div>
      <nav className="bg-card/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-primary" />
            <AnimatedShinyText>
              <span className="text-xl font-bold">TaskMan</span>
            </AnimatedShinyText>
          </div>
          {username ? (
            <div className="flex items-center gap-4">
              <AnimatedShinyText>
                <span className="text-lg font-bold">{username}</span>
              </AnimatedShinyText>
              <LogOut
                onClick={async () => {
                  await dispatch(logoutUser());
                  navigate("/");
                }}
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/auth/login")}
                variant={pathname === "/auth/login" ? `outline` : `default`}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/auth/register")}
                variant={pathname === "/auth/register" ? `outline` : `default`}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </nav>
      {children}
    </div>
  );
}
