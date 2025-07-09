import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, MapPin } from "lucide-react";

const classes = [
  {
    id: 1,
    name: "Gentle Yoga",
    time: "2:00 PM",
    duration: "60 min",
    instructor: "Sarah Kim",
    enrolled: 8,
    capacity: 12,
    room: "Studio A",
    status: "confirmed"
  },
  {
    id: 2,
    name: "Power Yoga",
    time: "4:00 PM",
    duration: "75 min",
    instructor: "Mike Chen",
    enrolled: 15,
    capacity: 15,
    room: "Studio B",
    status: "full"
  },
  {
    id: 3,
    name: "Meditation Circle",
    time: "5:30 PM",
    duration: "45 min",
    instructor: "Lisa Park",
    enrolled: 6,
    capacity: 10,
    room: "Studio A",
    status: "confirmed"
  },
  {
    id: 4,
    name: "Evening Vinyasa",
    time: "7:00 PM",
    duration: "90 min",
    instructor: "Emma Wilson",
    enrolled: 12,
    capacity: 16,
    room: "Studio B",
    status: "confirmed"
  },
  {
    id: 5,
    name: "Restorative Yoga",
    time: "8:30 PM",
    duration: "60 min",
    instructor: "David Lee",
    enrolled: 3,
    capacity: 8,
    room: "Studio A",
    status: "low"
  }
];

export function TodaysClasses() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "full": return "bg-destructive/10 text-destructive";
      case "low": return "bg-yellow-100 text-yellow-800";
      default: return "bg-primary/10 text-primary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "full": return "Full";
      case "low": return "Low Attendance";
      default: return "Confirmed";
    }
  };

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Today's Remaining Classes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {classes.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-medium">{cls.name}</h3>
                  <Badge className={getStatusColor(cls.status)}>
                    {getStatusText(cls.status)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{cls.time} ({cls.duration})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{cls.enrolled}/{cls.capacity}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{cls.room}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Instructor: {cls.instructor}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <Button size="sm" variant="secondary">
                  Attendance
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}