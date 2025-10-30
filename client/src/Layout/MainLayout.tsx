import { LightRays } from "@/components/ui/light-rays";
import { Layout } from "./Layout";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <LightRays />
      <Layout>{children}</Layout>
    </div>
  );
}
