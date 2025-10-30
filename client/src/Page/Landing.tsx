import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { MagicCard } from "@/components/ui/magic-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useTheme } from "@/context/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/hook";
import { verifyUser } from "@/Store/authSlice";
import { CheckCircle2, Clock, Zap } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Landing() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    async function verify() {
      dispatch(verifyUser());
    }
    if (!isAuthenticated) {
      verify();
    } else {
      navigate("/dashboard");
    }
  }, [dispatch, isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl md:text-6xl font-bold tracking-tight">
            Simplify Your Workflow And Boost Productivity Using
            <AnimatedShinyText className="block">TaskMan</AnimatedShinyText>
          </h1>
          <p className="text-l md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A beautiful and simple task manager to help you stay productive and
            organized. Create, manage, and complete your tasks with ease.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <ShimmerButton onClick={() => navigate("/dashboard")}>
            <AnimatedShinyText>Start Managing Tasks</AnimatedShinyText>
          </ShimmerButton>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <MagicCard
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            className="p-6 rounded-lg bg space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Simple & Clean</h3>
            <p className="text-muted-foreground">
              Focus on what matters with our minimalist and intuitive interface.
            </p>
          </MagicCard>

          <MagicCard
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            className="p-6 rounded-lg bg space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Track Progress</h3>
            <p className="text-muted-foreground">
              Monitor your tasks with status tracking and timestamps for better
              organization.
            </p>
          </MagicCard>

          <MagicCard
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            className="p-6 rounded-lg bg space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Stay Productive</h3>
            <p className="text-muted-foreground">
              Quickly add, edit, and manage tasks to keep your workflow smooth
              and efficient.
            </p>
          </MagicCard>
        </div>
      </div>
    </div>
  );
}
