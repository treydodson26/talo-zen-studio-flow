import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign, TrendingUp } from "lucide-react";

const metrics = [
  {
    title: "Today's Classes",
    value: "6",
    icon: Calendar,
    change: "+2 from yesterday",
    trend: "up"
  },
  {
    title: "Active Members",
    value: "127",
    icon: Users,
    change: "+5 this week",
    trend: "up"
  },
  {
    title: "Monthly Revenue",
    value: "$8,450",
    icon: DollarSign,
    change: "+12% from last month",
    trend: "up"
  },
  {
    title: "Class Utilization",
    value: "78%",
    icon: TrendingUp,
    change: "+3% from last week",
    trend: "up"
  }
];

export function MetricsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="shadow-card border-border/50 hover:shadow-soft transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metric.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}