import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, CreditCard, Users } from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "substitute",
    title: "Substitute Needed",
    message: "Power Yoga class tomorrow at 6 AM needs a substitute instructor",
    icon: AlertTriangle,
    action: "Find Substitute",
    urgent: true
  },
  {
    id: 2,
    type: "expiring",
    title: "Expiring Packages",
    message: "3 student packages expire within the next 7 days",
    icon: Clock,
    action: "Send Reminders",
    urgent: false
  },
  {
    id: 3,
    type: "payment",
    title: "Overdue Payments",
    message: "2 monthly payments are overdue",
    icon: CreditCard,
    action: "Send Notices",
    urgent: true
  },
  {
    id: 4,
    type: "capacity",
    title: "Low Attendance",
    message: "Evening Restorative class has only 2 registrations",
    icon: Users,
    action: "Promote Class",
    urgent: false
  }
];

export function Alerts() {
  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Studio Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Alert key={alert.id} className={`border ${alert.urgent ? 'border-destructive/50 bg-destructive/5' : 'border-border'}`}>
              <alert.icon className={`h-4 w-4 ${alert.urgent ? 'text-destructive' : 'text-primary'}`} />
              <AlertDescription className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                <Button size="sm" variant={alert.urgent ? "destructive" : "outline"}>
                  {alert.action}
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}