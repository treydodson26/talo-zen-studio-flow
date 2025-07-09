import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Calendar } from "lucide-react";

export function AvailabilityManagement() {
  const timeSlots = ["6:00 AM", "7:30 AM", "9:00 AM", "10:30 AM", "12:00 PM", "6:00 PM", "7:30 PM"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const instructors = [
    { name: "Sarah Johnson", available: true },
    { name: "Michael Chen", available: true },
    { name: "Jennifer Martinez", available: false },
    { name: "Amanda Wilson", available: true },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Instructor Availability Overview</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Set Weekly Pattern
              </Button>
              <Button size="sm">Block Time Off</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-2 text-sm">
              <div className="font-medium">Instructor</div>
              {days.map(day => (
                <div key={day} className="font-medium text-center">{day.slice(0, 3)}</div>
              ))}
            </div>
            
            {instructors.map((instructor, index) => (
              <div key={index} className="grid grid-cols-8 gap-2 items-center p-2 border rounded">
                <div className="font-medium">{instructor.name}</div>
                {days.map(day => (
                  <div key={day} className="text-center">
                    {instructor.available ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time Slot Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeSlots.map((slot, index) => (
              <div key={index} className="p-3 border rounded">
                <div className="font-medium mb-2">{slot}</div>
                <div className="space-y-1">
                  <Badge variant="default" className="mr-1">Sarah J.</Badge>
                  <Badge variant="secondary" className="mr-1">Michael C.</Badge>
                  <Badge variant="outline" className="mr-1">+2 more</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}