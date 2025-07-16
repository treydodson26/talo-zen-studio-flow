import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Mail, MessageSquare, Workflow, Settings } from "lucide-react";
import { SequenceManager } from "@/components/communications/SequenceManager";
import { TemplateManager } from "@/components/communications/TemplateManager";
import { CampaignManager } from "@/components/communications/CampaignManager";
import { CommunicationSettings } from "@/components/communications/CommunicationSettings";

const Communications = () => {
  const [activeTab, setActiveTab] = useState("sequences");

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communication Hub</h1>
          <p className="text-muted-foreground">
            Manage automated sequences, templates, and marketing campaigns
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sequences" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Sequences
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sequences" className="space-y-4">
          <SequenceManager />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplateManager />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <CampaignManager />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <CommunicationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communications;