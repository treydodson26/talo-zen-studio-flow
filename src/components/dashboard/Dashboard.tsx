import { Header } from "./Header";
import { MetricsCards } from "./MetricsCards";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { Alerts } from "./Alerts";
import { TodaysClasses } from "./TodaysClasses";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome back, Emily!</h1>
            <p className="text-muted-foreground">Here's what's happening at your studio today.</p>
          </div>

          {/* Metrics Cards */}
          <MetricsCards />

          {/* Quick Actions and Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <QuickActions />
            <RecentActivity />
          </div>

          {/* Alerts */}
          <Alerts />

          {/* Today's Classes */}
          <TodaysClasses />
        </div>
      </main>
    </div>
  );
}