import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Search, Filter, MoreHorizontal, Eye, Edit, Calendar, DollarSign, MessageSquare, UserX } from "lucide-react";
import { Instructor } from "@/types/instructors";
import { sampleInstructors } from "@/data/sampleInstructors";
import { InstructorProfileModal } from "./InstructorProfileModal";

export function InstructorManagement() {
  const [instructors, setInstructors] = useState<Instructor[]>(sampleInstructors);
  const [searchQuery, setSearchQuery] = useState("");
  const [certificationFilter, setCertificationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         instructor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCertification = certificationFilter === "all" || instructor.certificationLevel === certificationFilter;
    const matchesStatus = statusFilter === "all" || instructor.status === statusFilter;
    
    return matchesSearch && matchesCertification && matchesStatus;
  });

  const toggleAvailability = (instructorId: string) => {
    setInstructors(prev => 
      prev.map(instructor => 
        instructor.id === instructorId 
          ? { ...instructor, availableForSubs: !instructor.availableForSubs }
          : instructor
      )
    );
  };

  const openProfileModal = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsProfileModalOpen(true);
  };

  const activeCount = instructors.filter(i => i.status === 'active').length;
  const availableForSubsCount = instructors.filter(i => i.availableForSubs).length;
  const cert200Count = instructors.filter(i => i.certificationLevel === '200hr').length;
  const cert500Count = instructors.filter(i => i.certificationLevel === '500hr+').length;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Instructors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activeCount}</div>
            <p className="text-xs text-muted-foreground">8 regularly scheduled, 2 subs only</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available for Substitutes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{availableForSubsCount}</div>
            <p className="text-xs text-muted-foreground">3 responded to recent requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Certification Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cert200Count} × 200hr | {cert500Count} × 500hr+</div>
            <p className="text-xs text-warning">2 certifications expiring soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or certification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={certificationFilter} onValueChange={setCertificationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Certification Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Certifications</SelectItem>
                  <SelectItem value="200hr">200-Hour Certified</SelectItem>
                  <SelectItem value="500hr+">500+ Hour Certified</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Instructor</TableHead>
                <TableHead>Certification</TableHead>
                <TableHead>Specializations</TableHead>
                <TableHead>Rate Tier</TableHead>
                <TableHead className="text-center">Classes This Month</TableHead>
                <TableHead className="text-center">Available for Subs</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstructors.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={instructor.photo} />
                        <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{instructor.name}</div>
                        <div className="text-sm text-muted-foreground">{instructor.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={instructor.certificationLevel === '500hr+' ? 'default' : 'secondary'}>
                      {instructor.certificationLevel}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      Exp: {instructor.certificationExpiry}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {instructor.specializations.slice(0, 2).map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {instructor.specializations.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{instructor.specializations.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      ${instructor.baseRate} + ${instructor.perStudentRate}/student
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-medium">{instructor.classesThisMonth}</div>
                    <div className="text-xs text-muted-foreground">
                      ~${instructor.classesThisMonth * instructor.baseRate}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={instructor.availableForSubs}
                      onCheckedChange={() => toggleAvailability(instructor.id)}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {instructor.lastActive}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openProfileModal(instructor)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Info
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Update Availability
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DollarSign className="mr-2 h-4 w-4" />
                          View Payment History
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <UserX className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Profile Modal */}
      {selectedInstructor && (
        <InstructorProfileModal
          instructor={selectedInstructor}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
}