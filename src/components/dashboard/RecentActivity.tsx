import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar, CreditCard } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "enrollment",
    message: "Sarah Johnson enrolled in Morning Vinyasa",
    time: "5 minutes ago",
    icon: User,
    badge: "New Member"
  },
  {
    id: 2,
    type: "attendance",
    message: "12 students checked in for Power Yoga",
    time: "1 hour ago",
    icon: Calendar,
    badge: "Class Full"
  },
  {
    id: 3,
    type: "payment",
    message: "Monthly payment received from Mike Chen",
    time: "2 hours ago",
    icon: CreditCard,
    badge: "Payment"
  },
  {
    id: 4,
    type: "schedule",
    message: "New class added: Gentle Yoga at 7 PM",
    time: "3 hours ago",
    icon: Clock,
    badge: "Schedule"
  },
  {
    id: 5,
    type: "enrollment",
    message: "Lisa Park joined Meditation Circle",
    time: "4 hours ago",
    icon: User,
    badge: "New Member"
  }
];

export function RecentActivity() {
  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <activity.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.message}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                  <Badge variant="secondary" className="text-xs">
                    {activity.badge}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}