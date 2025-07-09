import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Clock, CheckCircle, XCircle, MessageSquare, Plus, User } from "lucide-react";
import { SubstituteRequest, SubstituteResponse } from "@/types/instructors";

export function SubstituteManagement() {
  const [requests, setRequests] = useState<SubstituteRequest[]>([
    {
      id: "1",
      date: "2024-01-10",
      time: "6:00 PM",
      classType: "Vinyasa Flow",
      room: "Room A",
      originalInstructor: "Sarah Johnson",
      expectedAttendance: 12,
      reason: "Sick",
      urgency: "urgent",
      postedAt: "2024-01-09T16:00:00Z",
      status: "open",
      payRate: 100,
      responses: [
        {
          instructorId: "2",
          instructorName: "Michael Chen",
          response: "available",
          responseTime: "2024-01-09T16:15:00Z",
          notes: "Happy to cover this class"
        },
        {
          instructorId: "3",
          instructorName: "Jennifer Martinez",
          response: "not_available",
          responseTime: "2024-01-09T16:30:00Z",
          notes: "Already teaching at this time"
        }
      ]
    },
    {
      id: "2",
      date: "2024-01-12",
      time: "7:30 AM",
      classType: "Prenatal Yoga",
      room: "Room B",
      originalInstructor: "Amanda Wilson",
      expectedAttendance: 8,
      reason: "Vacation",
      urgency: "normal",
      postedAt: "2024-01-08T10:00:00Z",
      status: "filled",
      payRate: 50,
      responses: [
        {
          instructorId: "1",
          instructorName: "Sarah Johnson",
          response: "available",
          responseTime: "2024-01-08T10:45:00Z",
          confirmed: true
        }
      ]
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    date: "",
    time: "",
    classType: "",
    room: "",
    originalInstructor: "",
    expectedAttendance: "",
    reason: "",
    specialRequirements: ""
  });

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getResponseIcon = (response: string) => {
    switch (response) {
      case 'available': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'not_available': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <MessageSquare className="h-4 w-4 text-yellow-500" />;
    }
  };

  const handleCreateRequest = () => {
    // Create new substitute request logic
    setIsCreateModalOpen(false);
    setNewRequest({
      date: "",
      time: "",
      classType: "",
      room: "",
      originalInstructor: "",
      expectedAttendance: "",
      reason: "",
      specialRequirements: ""
    });
  };

  const assignInstructor = (requestId: string, instructorId: string) => {
    // Assign instructor logic
    console.log("Assigning instructor", instructorId, "to request", requestId);
  };

  const openRequests = requests.filter(r => r.status === 'open');
  const filledRequests = requests.filter(r => r.status === 'filled');

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{openRequests.length}</div>
            <p className="text-xs text-muted-foreground">Need coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Filled This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">23/25</div>
            <p className="text-xs text-muted-foreground">92% success rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 hrs</div>
            <p className="text-xs text-muted-foreground">Getting faster</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Substitute</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Jennifer L.</div>
            <p className="text-xs text-muted-foreground">Avg 15 min response</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Substitute Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Substitute Requests</CardTitle>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Substitute Request</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newRequest.date}
                        onChange={(e) => setNewRequest({...newRequest, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newRequest.time}
                        onChange={(e) => setNewRequest({...newRequest, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Class Type *</Label>
                      <Select value={newRequest.classType} onValueChange={(value) => setNewRequest({...newRequest, classType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vinyasa Flow">Vinyasa Flow</SelectItem>
                          <SelectItem value="Prenatal Yoga">Prenatal Yoga</SelectItem>
                          <SelectItem value="Yin Yoga">Yin Yoga</SelectItem>
                          <SelectItem value="Hot Yoga">Hot Yoga</SelectItem>
                          <SelectItem value="Restorative">Restorative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Room</Label>
                      <Select value={newRequest.room} onValueChange={(value) => setNewRequest({...newRequest, room: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Room A">Room A</SelectItem>
                          <SelectItem value="Room B">Room B</SelectItem>
                          <SelectItem value="Room C">Room C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="attendance">Expected Attendance</Label>
                      <Input
                        id="attendance"
                        type="number"
                        value={newRequest.expectedAttendance}
                        onChange={(e) => setNewRequest({...newRequest, expectedAttendance: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Reason</Label>
                      <Select value={newRequest.reason} onValueChange={(value) => setNewRequest({...newRequest, reason: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sick">Sick</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                          <SelectItem value="Vacation">Vacation</SelectItem>
                          <SelectItem value="Personal">Personal</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="requirements">Special Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={newRequest.specialRequirements}
                      onChange={(e) => setNewRequest({...newRequest, specialRequirements: e.target.value})}
                      placeholder="Any specific certifications or notes..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateRequest}>
                      Create Request
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {openRequests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getUrgencyIcon(request.urgency)}
                      <span className="font-medium text-sm">
                        {request.urgency === 'urgent' ? 'URGENT' : request.urgency.toUpperCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {request.date} {request.time}
                      </span>
                    </div>
                    <Badge variant={request.status === 'open' ? 'destructive' : 'default'}>
                      {request.responses.length} responses
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold">{request.classType} with {request.originalInstructor}</h3>
                    <p className="text-sm text-muted-foreground">
                      {request.expectedAttendance} students registered | {request.room}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Posted: {new Date(request.postedAt).toLocaleDateString()} | Pay: ${request.payRate}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Responses:</h4>
                    {request.responses.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No responses yet</p>
                    ) : (
                      <div className="space-y-2">
                        {request.responses.map((response, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center gap-2">
                              {getResponseIcon(response.response)}
                              <span className="text-sm font-medium">{response.instructorName}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(response.responseTime).toLocaleTimeString()}
                              </span>
                            </div>
                            {response.response === 'available' && (
                              <Button
                                size="sm"
                                onClick={() => assignInstructor(request.id, response.instructorId)}
                              >
                                Assign
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Broadcast Again
                    </Button>
                    <Button variant="outline" size="sm">
                      Manual Assign
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      Cancel Class
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Substitute History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Substitute History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Original Instructor</TableHead>
                <TableHead>Substitute</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filledRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>{request.classType}</TableCell>
                  <TableCell>{request.originalInstructor}</TableCell>
                  <TableCell>
                    {request.responses.find(r => r.confirmed)?.instructorName || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {request.responses.find(r => r.confirmed)?.responseTime 
                      ? new Date(request.responses.find(r => r.confirmed)!.responseTime).toLocaleTimeString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">Filled</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}