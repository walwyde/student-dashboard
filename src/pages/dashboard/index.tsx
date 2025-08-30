import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/AppSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const router = useRouter();

  if (!user) {
    // Redirect on unauthenticated, but return null to satisfy ReactNode
    router.push("/auth");
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-4">
            <SidebarTrigger />
          </header>
          <main className="flex-1 p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

const Dashboard = () => {
  const { profile } = useAuth() as any;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {profile?.full_name || "Student"}!
          </h1>
          <p className="text-muted-foreground">
            Access your student information and digital ID card
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Digital ID Card</h3>
            <p className="text-sm text-muted-foreground mt-2">
              View and print your official student ID card
            </p>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">My Courses</h3>
            <p className="text-sm text-muted-foreground mt-2">
              View your enrolled courses and schedules
            </p>
          </div>

          <div className="rounded-lg border grow-1 bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Academic Year</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Current academic year: 2024/2025
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;