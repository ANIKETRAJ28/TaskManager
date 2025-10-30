import { AuthBackground } from "@/components/AuthBackground";
import { Layout } from "./Layout";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AuthBackground />
      <Layout>{children}</Layout>
    </div>
  );
}
