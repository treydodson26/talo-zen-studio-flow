import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Calculator, Download, ChevronRight } from "lucide-react";
import { InstructorManagement } from "@/components/instructors/InstructorManagement";
import { SubstituteManagement } from "@/components/instructors/SubstituteManagement";
import { PayrollManagement } from "@/components/instructors/PayrollManagement";
import { AvailabilityManagement } from "@/components/instructors/AvailabilityManagement";

export default function InstructorHub() {
  const [activeTab, setActiveTab] = useState("instructors");

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <span>Dashboard</span>
                  <ChevronRight className="h-4 w-4 mx-1" />
                  <span>Instructor Hub</span>
                </div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-foreground">Instructor Hub</h1>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    12 Active Instructors
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button variant="secondary" size="sm" className="gap-2">
                <Calculator className="h-4 w-4" />
                Calculate Payroll
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Instructor
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="instructors">Instructors</TabsTrigger>
            <TabsTrigger value="substitutes">Substitutes</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="instructors" className="space-y-6">
            <InstructorManagement />
          </TabsContent>

          <TabsContent value="substitutes" className="space-y-6">
            <SubstituteManagement />
          </TabsContent>

          <TabsContent value="payroll" className="space-y-6">
            <PayrollManagement />
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <AvailabilityManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}