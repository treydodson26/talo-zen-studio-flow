import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, CheckCircle, MessageCircle, CalendarDays } from "lucide-react";

const actions = [
  {
    title: "Add Lead",
    description: "Create new lead profile",
    icon: UserPlus,
    variant: "default" as const
  },
  {
    title: "Mark Attendance",
    description: "Check in students",
    icon: CheckCircle,
    variant: "secondary" as const
  },
  {
    title: "Send Message",
    description: "Communicate with members",
    icon: MessageCircle,
    variant: "outline" as const
  },
  {
    title: "View Schedule",
    description: "See upcoming classes",
    icon: CalendarDays,
    variant: "outline" as const
  }
];

export function QuickActions() {
  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-soft transition-shadow"
            >
              <div className="flex items-center space-x-2">
                <action.icon className="h-5 w-5" />
                <span className="font-medium">{action.title}</span>
              </div>
              <span className="text-sm text-muted-foreground">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}