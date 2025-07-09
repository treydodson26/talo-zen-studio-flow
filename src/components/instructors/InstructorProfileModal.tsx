import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, MessageSquare, Calendar, Phone, Mail, Shield, DollarSign, TrendingUp, Clock, Award } from "lucide-react";
import { Instructor } from "@/types/instructors";

interface InstructorProfileModalProps {
  instructor: Instructor;
  isOpen: boolean;
  onClose: () => void;
}

export function InstructorProfileModal({ instructor, isOpen, onClose }: InstructorProfileModalProps) {
  const [activeTab, setActiveTab] = useState("personal");

  const specializations = ["Vinyasa", "Yin", "Prenatal", "Hot Yoga", "Restorative", "Power Yoga", "Gentle", "Meditation"];

  // Sample class history data
  const recentClasses = [
    { date: "2024-01-08", type: "Vinyasa Flow", attendance: 14, earnings: 106 },
    { date: "2024-01-07", type: "Prenatal Yoga", attendance: 8, earnings: 90 },
    { date: "2024-01-06", type: "Yin Yoga", attendance: 12, earnings: 110 },
    { date: "2024-01-05", type: "Vinyasa Flow", attendance: 16, earnings: 130 },
    { date: "2024-01-04", type: "Restorative", attendance: 10, earnings: 100 },
  ];

  const paymentHistory = [
    { period: "Dec 2024", basePay: 800, bonuses: 320, total: 1120, status: "Processed" },
    { period: "Nov 2024", basePay: 750, bonuses: 280, total: 1030, status: "Processed" },
    { period: "Oct 2024", basePay: 900, bonuses: 360, total: 1260, status: "Processed" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={instructor.photo} />
                <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{instructor.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={instructor.certificationLevel === '500hr+' ? 'default' : 'secondary'}>
                    {instructor.certificationLevel}
                  </Badge>
                  <Badge variant={instructor.status === 'active' ? 'default' : 'secondary'}>
                    {instructor.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Instructor since Dec 2020
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={instructor.name.split(' ')[0]} />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={instructor.name.split(' ')[1]} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={instructor.email} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={instructor.phone} />
                  </div>
                  <div>
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input id="emergency" value={instructor.emergencyContact} />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" value={instructor.bio} rows={3} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Certification Level</Label>
                      <Select value={instructor.certificationLevel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="200hr">200-Hour</SelectItem>
                          <SelectItem value="500hr+">500+ Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="certExpiry">Certification Expiry</Label>
                      <Input id="certExpiry" type="date" value={instructor.certificationExpiry} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input id="experience" type="number" value={instructor.yearsExperience} />
                  </div>
                  <div>
                    <Label>Specializations</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {specializations.map((spec) => (
                        <div key={spec} className="flex items-center space-x-2">
                          <Checkbox
                            id={spec}
                            checked={instructor.specializations.includes(spec)}
                          />
                          <Label htmlFor={spec} className="text-sm">{spec}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="insurance">Insurance Information</Label>
                    <Input id="insurance" value={instructor.insuranceInfo} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="baseRate">Base Rate per Class</Label>
                    <Input id="baseRate" type="number" value={instructor.baseRate} />
                  </div>
                  <div>
                    <Label htmlFor="perStudentRate">Per-Student Bonus</Label>
                    <Input id="perStudentRate" type="number" value={instructor.perStudentRate} />
                  </div>
                  <div>
                    <Label htmlFor="subMultiplier">Substitute Multiplier</Label>
                    <Input id="subMultiplier" type="number" value="2.0" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={instructor.paymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct_deposit">Direct Deposit</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>W-9 Status</Label>
                    <Select value={instructor.w9Status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complete">Complete</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="not_required">Not Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regular Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Monday 6:00 PM</span>
                      <span>Vinyasa Flow</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Wednesday 7:30 AM</span>
                      <span>Prenatal Yoga</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Friday 6:00 PM</span>
                      <span>Yin Yoga</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Substitute Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Available for Substitutes</span>
                      <Badge variant={instructor.availableForSubs ? 'default' : 'secondary'}>
                        {instructor.availableForSubs ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div>
                      <Label>Preferred Response Time</Label>
                      <Select defaultValue="2hours">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="1hour">Within 1 hour</SelectItem>
                          <SelectItem value="2hours">Within 2 hours</SelectItem>
                          <SelectItem value="4hours">Within 4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Available Days/Times</Label>
                      <div className="text-sm text-muted-foreground">
                        Mon-Fri: 6:00 AM - 8:00 PM<br />
                        Sat-Sun: 8:00 AM - 6:00 PM
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{instructor.classesThisMonth}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Avg Class Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.3</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Substitute Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Class History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Class Type</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentClasses.map((cls, index) => (
                      <TableRow key={index}>
                        <TableCell>{cls.date}</TableCell>
                        <TableCell>{cls.type}</TableCell>
                        <TableCell>{cls.attendance}</TableCell>
                        <TableCell>${cls.earnings}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Base Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${instructor.classesThisMonth * instructor.baseRate}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Student Bonuses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${instructor.classesThisMonth * 12 * instructor.perStudentRate}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Substitute Premium</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$200</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Gross</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,080</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pay Period</TableHead>
                      <TableHead>Base Pay</TableHead>
                      <TableHead>Bonuses</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>{payment.period}</TableCell>
                        <TableCell>${payment.basePay}</TableCell>
                        <TableCell>${payment.bonuses}</TableCell>
                        <TableCell>${payment.total}</TableCell>
                        <TableCell>
                          <Badge variant="default">{payment.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}