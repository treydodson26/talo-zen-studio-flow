import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Mail, MessageSquare, Clock, Shield, Globe, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_category: string;
  description: string | null;
  setting_type: string | null;
}

export const CommunicationSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [emailSettings, setEmailSettings] = useState({
    from_name: "Talo Yoga Studio",
    from_email: "hello@taloyoga.com",
    reply_to: "hello@taloyoga.com",
    default_timezone: "America/Chicago",
    max_send_rate: "100",
    bounce_handling: true,
    unsubscribe_handling: true
  });

  const [smsSettings, setSmsSettings] = useState({
    default_country_code: "+1",
    max_sms_per_hour: "50",
    opt_out_keywords: "STOP, UNSUBSCRIBE, QUIT",
    business_hours_start: "09:00",
    business_hours_end: "21:00",
    weekend_sending: false
  });

  const [automationSettings, setAutomationSettings] = useState({
    welcome_sequence_enabled: true,
    trial_reminder_enabled: true,
    win_back_enabled: true,
    class_reminder_hours: "2",
    follow_up_delay_hours: "24",
    max_automation_sends_per_day: "5"
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('setting_category', 'communication')
        .order('setting_key');

      if (error) throw error;
      setSettings(data || []);
      
      // Populate form values from database settings
      data?.forEach(setting => {
        if (setting.setting_key.startsWith('email_')) {
          const key = setting.setting_key.replace('email_', '');
          if (key in emailSettings) {
            setEmailSettings(prev => ({ ...prev, [key]: setting.setting_value || prev[key as keyof typeof prev] }));
          }
        } else if (setting.setting_key.startsWith('sms_')) {
          const key = setting.setting_key.replace('sms_', '');
          if (key in smsSettings) {
            setSmsSettings(prev => ({ ...prev, [key]: setting.setting_value || prev[key as keyof typeof prev] }));
          }
        } else if (setting.setting_key.startsWith('automation_')) {
          const key = setting.setting_key.replace('automation_', '');
          if (key in automationSettings) {
            const value = setting.setting_value === 'true' ? true : setting.setting_value === 'false' ? false : setting.setting_value;
            setAutomationSettings(prev => ({ ...prev, [key]: value || prev[key as keyof typeof prev] }));
          }
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch communication settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (category: string, settings: any) => {
    setIsSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: `${category}_${key}`,
        setting_value: String(value),
        setting_category: 'communication',
        description: `${category} setting for ${key.replace('_', ' ')}`
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('system_settings')
          .upsert(update, { onConflict: 'setting_key' });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Settings saved successfully"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from_name">From Name</Label>
              <Input
                id="from_name"
                value={emailSettings.from_name}
                onChange={(e) => setEmailSettings({...emailSettings, from_name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="from_email">From Email</Label>
              <Input
                id="from_email"
                type="email"
                value={emailSettings.from_email}
                onChange={(e) => setEmailSettings({...emailSettings, from_email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="reply_to">Reply-To Email</Label>
              <Input
                id="reply_to"
                type="email"
                value={emailSettings.reply_to}
                onChange={(e) => setEmailSettings({...emailSettings, reply_to: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="default_timezone">Default Timezone</Label>
              <Select value={emailSettings.default_timezone} onValueChange={(value) => setEmailSettings({...emailSettings, default_timezone: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_send_rate">Max Send Rate (per hour)</Label>
              <Input
                id="max_send_rate"
                type="number"
                value={emailSettings.max_send_rate}
                onChange={(e) => setEmailSettings({...emailSettings, max_send_rate: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="bounce_handling"
                  checked={emailSettings.bounce_handling}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, bounce_handling: checked})}
                />
                <Label htmlFor="bounce_handling">Handle bounces automatically</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="unsubscribe_handling"
                  checked={emailSettings.unsubscribe_handling}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, unsubscribe_handling: checked})}
                />
                <Label htmlFor="unsubscribe_handling">Handle unsubscribes automatically</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={() => saveSettings('email', emailSettings)}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Email Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SMS Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="default_country_code">Default Country Code</Label>
              <Select value={smsSettings.default_country_code} onValueChange={(value) => setSmsSettings({...smsSettings, default_country_code: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                  <SelectItem value="+44">+44 (UK)</SelectItem>
                  <SelectItem value="+61">+61 (Australia)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="max_sms_per_hour">Max SMS per Hour</Label>
              <Input
                id="max_sms_per_hour"
                type="number"
                value={smsSettings.max_sms_per_hour}
                onChange={(e) => setSmsSettings({...smsSettings, max_sms_per_hour: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="business_hours_start">Business Hours Start</Label>
              <Input
                id="business_hours_start"
                type="time"
                value={smsSettings.business_hours_start}
                onChange={(e) => setSmsSettings({...smsSettings, business_hours_start: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="business_hours_end">Business Hours End</Label>
              <Input
                id="business_hours_end"
                type="time"
                value={smsSettings.business_hours_end}
                onChange={(e) => setSmsSettings({...smsSettings, business_hours_end: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="opt_out_keywords">Opt-out Keywords</Label>
            <Input
              id="opt_out_keywords"
              value={smsSettings.opt_out_keywords}
              onChange={(e) => setSmsSettings({...smsSettings, opt_out_keywords: e.target.value})}
              placeholder="STOP, UNSUBSCRIBE, QUIT"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="weekend_sending"
              checked={smsSettings.weekend_sending}
              onCheckedChange={(checked) => setSmsSettings({...smsSettings, weekend_sending: checked})}
            />
            <Label htmlFor="weekend_sending">Allow weekend sending</Label>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={() => saveSettings('sms', smsSettings)}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save SMS Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Automation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class_reminder_hours">Class Reminder (hours before)</Label>
              <Input
                id="class_reminder_hours"
                type="number"
                value={automationSettings.class_reminder_hours}
                onChange={(e) => setAutomationSettings({...automationSettings, class_reminder_hours: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="follow_up_delay_hours">Follow-up Delay (hours)</Label>
              <Input
                id="follow_up_delay_hours"
                type="number"
                value={automationSettings.follow_up_delay_hours}
                onChange={(e) => setAutomationSettings({...automationSettings, follow_up_delay_hours: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="max_automation_sends_per_day">Max Automation Sends per Day</Label>
              <Input
                id="max_automation_sends_per_day"
                type="number"
                value={automationSettings.max_automation_sends_per_day}
                onChange={(e) => setAutomationSettings({...automationSettings, max_automation_sends_per_day: e.target.value})}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="font-medium">Automated Sequences</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="welcome_sequence_enabled"
                  checked={automationSettings.welcome_sequence_enabled}
                  onCheckedChange={(checked) => setAutomationSettings({...automationSettings, welcome_sequence_enabled: checked})}
                />
                <Label htmlFor="welcome_sequence_enabled">Welcome sequence for new leads</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="trial_reminder_enabled"
                  checked={automationSettings.trial_reminder_enabled}
                  onCheckedChange={(checked) => setAutomationSettings({...automationSettings, trial_reminder_enabled: checked})}
                />
                <Label htmlFor="trial_reminder_enabled">Trial expiration reminders</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="win_back_enabled"
                  checked={automationSettings.win_back_enabled}
                  onCheckedChange={(checked) => setAutomationSettings({...automationSettings, win_back_enabled: checked})}
                />
                <Label htmlFor="win_back_enabled">Win-back campaigns for inactive customers</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={() => saveSettings('automation', automationSettings)}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Automation Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};