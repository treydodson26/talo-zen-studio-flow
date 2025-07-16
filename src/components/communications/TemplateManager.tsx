import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Mail, MessageSquare, Copy, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CommunicationTemplate {
  id: string;
  name: string;
  template_type: string;
  category: string;
  subject_line: string | null;
  content_text: string;
  content_html: string | null;
  is_active: boolean;
  is_automated: boolean;
  variables_available: string[] | null;
  created_at: string;
}

export const TemplateManager = () => {
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    template_type: "email",
    category: "welcome",
    subject_line: "",
    content_text: "",
    content_html: "",
    variables_available: ["{{first_name}}", "{{last_name}}", "{{email}}"]
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch communication templates",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .insert([newTemplate])
        .select()
        .single();

      if (error) throw error;

      setTemplates([data, ...templates]);
      setNewTemplate({
        name: "",
        template_type: "email",
        category: "welcome",
        subject_line: "",
        content_text: "",
        content_html: "",
        variables_available: ["{{first_name}}", "{{last_name}}", "{{email}}"]
      });
      setShowCreateDialog(false);
      
      toast({
        title: "Success",
        description: "Template created successfully"
      });
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const { error } = await supabase
        .from('communication_templates')
        .update({
          name: selectedTemplate.name,
          subject_line: selectedTemplate.subject_line,
          content_text: selectedTemplate.content_text,
          content_html: selectedTemplate.content_html,
          variables_available: selectedTemplate.variables_available
        })
        .eq('id', selectedTemplate.id);

      if (error) throw error;

      setTemplates(templates.map(template => 
        template.id === selectedTemplate.id ? selectedTemplate : template
      ));
      setShowEditDialog(false);
      
      toast({
        title: "Success",
        description: "Template updated successfully"
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive"
      });
    }
  };

  const toggleTemplateStatus = async (templateId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('communication_templates')
        .update({ is_active: !currentStatus })
        .eq('id', templateId);

      if (error) throw error;

      setTemplates(templates.map(template => 
        template.id === templateId ? { ...template, is_active: !currentStatus } : template
      ));
      
      toast({
        title: "Success",
        description: `Template ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update template status",
        variant: "destructive"
      });
    }
  };

  const duplicateTemplate = async (template: CommunicationTemplate) => {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .insert([{
          name: `${template.name} (Copy)`,
          template_type: template.template_type,
          category: template.category,
          subject_line: template.subject_line,
          content_text: template.content_text,
          content_html: template.content_html,
          variables_available: template.variables_available
        }])
        .select()
        .single();

      if (error) throw error;

      setTemplates([data, ...templates]);
      
      toast({
        title: "Success",
        description: "Template duplicated successfully"
      });
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate template",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading templates...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Templates List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Message Templates</CardTitle>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Template Name</Label>
                      <Input
                        id="name"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                        placeholder="Welcome email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Template Type</Label>
                      <Select value={newTemplate.template_type} onValueChange={(value) => setNewTemplate({...newTemplate, template_type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newTemplate.category} onValueChange={(value) => setNewTemplate({...newTemplate, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Welcome</SelectItem>
                        <SelectItem value="nurture">Nurture</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="follow_up">Follow Up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newTemplate.template_type === 'email' && (
                    <div>
                      <Label htmlFor="subject">Subject Line</Label>
                      <Input
                        id="subject"
                        value={newTemplate.subject_line}
                        onChange={(e) => setNewTemplate({...newTemplate, subject_line: e.target.value})}
                        placeholder="Welcome to Talo Yoga, {{first_name}}!"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="content">Message Content</Label>
                    <Textarea
                      id="content"
                      value={newTemplate.content_text}
                      onChange={(e) => setNewTemplate({...newTemplate, content_text: e.target.value})}
                      placeholder="Hi {{first_name}}, welcome to Talo Yoga..."
                      rows={6}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTemplate}>
                      Create Template
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate?.id === template.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {template.template_type === 'email' && <Mail className="h-5 w-5 text-blue-500" />}
                    {template.template_type === 'sms' && <MessageSquare className="h-5 w-5 text-green-500" />}
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.category} • {template.template_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={template.is_active ? 'default' : 'secondary'}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Switch
                      checked={template.is_active}
                      onCheckedChange={() => toggleTemplateStatus(template.id, template.is_active)}
                    />
                  </div>
                </div>
                {template.subject_line && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Subject: {template.subject_line}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Editor */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedTemplate ? `Edit: ${selectedTemplate.name}` : 'Select a Template'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedTemplate ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedTemplate.template_type}</Badge>
                  <Badge variant="outline">{selectedTemplate.category}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => duplicateTemplate(selectedTemplate)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </Button>
                  <Button size="sm" onClick={() => setShowEditDialog(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Template Name</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTemplate.name}</p>
                </div>
                
                {selectedTemplate.subject_line && (
                  <div>
                    <Label>Subject Line</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedTemplate.subject_line}</p>
                  </div>
                )}
                
                <div>
                  <Label>Message Content</Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedTemplate.content_text}</p>
                  </div>
                </div>
                
                {selectedTemplate.variables_available && selectedTemplate.variables_available.length > 0 && (
                  <div>
                    <Label>Available Variables</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedTemplate.variables_available.map((variable, index) => (
                        <Badge key={index} variant="secondary">{variable}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Dialog */}
              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Template</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name">Template Name</Label>
                      <Input
                        id="edit-name"
                        value={selectedTemplate.name}
                        onChange={(e) => setSelectedTemplate({...selectedTemplate, name: e.target.value})}
                      />
                    </div>
                    
                    {selectedTemplate.template_type === 'email' && (
                      <div>
                        <Label htmlFor="edit-subject">Subject Line</Label>
                        <Input
                          id="edit-subject"
                          value={selectedTemplate.subject_line || ''}
                          onChange={(e) => setSelectedTemplate({...selectedTemplate, subject_line: e.target.value})}
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="edit-content">Message Content</Label>
                      <Textarea
                        id="edit-content"
                        value={selectedTemplate.content_text}
                        onChange={(e) => setSelectedTemplate({...selectedTemplate, content_text: e.target.value})}
                        rows={8}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateTemplate}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a template to view and edit its content</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};