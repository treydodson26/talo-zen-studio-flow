import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadCard } from "./LeadCard";
import { LeadDetailsModal } from "./LeadDetailsModal";
import { Lead } from "@/types/leads";
import { sampleLeads, getLeadsByStage, getLeadStats } from "@/data/sampleLeads";
import { Search, Filter, Plus, BarChart3 } from "lucide-react";

const stages = [
  { id: 'new', name: 'New', color: 'bg-blue-100 text-blue-800' },
  { id: 'contacted', name: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'nurturing', name: 'Nurturing', color: 'bg-purple-100 text-purple-800' },
  { id: 'converted', name: 'Converted', color: 'bg-green-100 text-green-800' },
  { id: 'lost', name: 'Lost', color: 'bg-red-100 text-red-800' }
];

export function LeadPipeline() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");
  
  const stats = getLeadStats();
  
  const filteredLeads = sampleLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    const matchesStaff = staffFilter === "all" || lead.assigned_staff === staffFilter;
    
    return matchesSearch && matchesSource && matchesStaff;
  });

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleQuickAction = (leadId: string, action: string) => {
    console.log(`Quick action: ${action} for lead ${leadId}`);
    // TODO: Implement quick actions
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lead Pipeline</h1>
            <p className="text-muted-foreground">Manage and track your studio leads</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{stats.total_leads}</div>
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{stats.new_leads}</div>
              <div className="text-sm text-muted-foreground">New This Week</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{stats.conversion_rate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{stats.avg_time_to_convert}d</div>
              <div className="text-sm text-muted-foreground">Avg. Time to Convert</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="qr_code">QR Code</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="walk_in">Walk-in</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                </SelectContent>
              </Select>
              <Select value={staffFilter} onValueChange={setStaffFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="All Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  <SelectItem value="Emily">Emily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {stages.map((stage) => {
            const stageLeads = filteredLeads.filter(lead => lead.stage === stage.id);
            
            return (
              <Card key={stage.id} className="h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stage.name}</span>
                    <Badge className={stage.color}>
                      {stageLeads.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {stageLeads.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        onViewDetails={handleViewDetails}
                        onQuickAction={handleQuickAction}
                      />
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        <p className="text-sm">No leads in this stage</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Lead Details Modal */}
        {selectedLead && (
          <LeadDetailsModal 
            lead={selectedLead}
            onClose={handleCloseModal}
            onUpdate={() => {
              // TODO: Implement lead update
              console.log("Lead updated");
            }}
          />
        )}
      </div>
    </div>
  );
}