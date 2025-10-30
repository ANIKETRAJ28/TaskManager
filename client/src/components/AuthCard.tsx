import { Label } from "@radix-ui/react-label";
import MoonLoader from "react-spinners/MoonLoader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ShineBorder } from "./ui/shine-border";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AnimatedShinyText } from "./ui/animated-shiny-text";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupUser, loginUser } from "@/Store/authSlice";
import { useAppDispatch } from "@/hook";
import { passwordSchema, usernameSchema } from "@/util/zod";
import { toast } from "sonner";

interface AuthCardProps {
  title: string;
  navigateTo: string;
}

export function AuthCard({ title, navigateTo }: AuthCardProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const submit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      let type = "";
      const messages: string[] = [];
      const username_parse = usernameSchema.safeParse(username);
      const password_parse = passwordSchema.safeParse(password);
      if (!username_parse.success) {
        const errors = JSON.parse(username_parse.error.message);
        const message: string = errors
          .map((err: { message: string }) => err.message)
          .join(", ");
        messages.push(message);
      }
      if (!password_parse.success) {
        const errors = JSON.parse(password_parse.error.message);
        const message = errors
          .map((err: { message: string }) => err.message)
          .join(", ");
        messages.push(message);
      }
      if (!username_parse.success || !password_parse.success) {
        toast.error(messages.join("\n"));
        return;
      }
      if (pathname === "/auth/login") {
        const res = await dispatch(loginUser({ username, password }));
        if (res.meta.requestStatus === "fulfilled") navigate("/dashboard");
        type = res.meta.requestStatus;
      } else if (pathname === "/auth/register") {
        const res = await dispatch(signupUser({ username, password }));
        if (res.meta.requestStatus === "fulfilled") navigate("/dashboard");
        type = res.meta.requestStatus;
        if (type === "fulfilled") {
          setUserName("");
          setPassword("");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="relative overflow-hidden w-full max-w-sm">
      <ShineBorder shineColor={["#ffffff", "#0f172a", "#000000"]} />
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => submit(e)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="username"
                type="text"
                placeholder="name@example.com"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button
          type="submit"
          className="w-full"
          onClick={(e) => submit(e)}
        >
          {loading ? (
            <MoonLoader
              size={20}
              speedMultiplier={1}
            />
          ) : navigateTo === "register" ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">
            {navigateTo === "register" ? "Don't have" : "Have"} an account?{" "}
          </span>
          <AnimatedShinyText
            className="cursor-pointer font-medium"
            onClick={() => navigate(`/auth/${navigateTo}`)}
          >
            {navigateTo === "register" ? "Create one" : "Login here"}
          </AnimatedShinyText>
        </div>
      </CardFooter>
    </Card>
  );
}
