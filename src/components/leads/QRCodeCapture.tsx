import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, CheckCircle, Copy, ExternalLink } from "lucide-react";

export function QRCodeCapture() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    interests: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // This would be the actual QR code URL in production
  const qrCodeUrl = `${window.location.origin}/leads/capture`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save lead to Supabase
      const { data, error } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            source: formData.source || 'qr_code',
            interests: formData.interests,
            notes: formData.notes,
            stage: 'new'
          }
        ])
        .select();

      if (error) {
        console.error('Error creating lead:', error);
        toast({
          title: "Error",
          description: "There was an issue submitting your information. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Lead created successfully:', data);
      setIsSubmitted(true);
      toast({
        title: "Welcome to Talo Yoga Studio!",
        description: "We'll be in touch soon to help you start your yoga journey.",
      });

    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrCodeUrl);
    toast({
      title: "URL Copied!",
      description: "The lead capture URL has been copied to your clipboard.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-6">
            Welcome to Talo Yoga Studio! We're excited to help you begin your yoga journey.
          </p>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Watch our studio introduction video to learn more about our classes and community.
              </p>
              <Button className="mt-2" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Watch Video
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Emily will contact you within 24 hours to discuss your yoga goals and schedule your first class.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* QR Code Section */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <QrCode className="h-6 w-6" />
                <span>Lead Capture QR Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {/* Placeholder for QR Code - In production, you'd use a QR code generation library */}
              <div className="bg-muted p-8 rounded-lg">
                <div className="w-48 h-48 bg-background border-2 border-dashed border-border rounded-lg mx-auto flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">QR Code</p>
                    <p className="text-xs text-muted-foreground">Scan to join</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Share this URL or QR code with potential leads:
                </p>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={qrCodeUrl} 
                    readOnly 
                    className="text-sm"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleCopyUrl}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lead Capture Form */}
          <Card>
            <CardHeader>
              <CardTitle>Join Talo Yoga Studio</CardTitle>
              <p className="text-muted-foreground">
                Start your yoga journey with us. Fill out the form below and we'll be in touch soon!
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">How did you hear about us?</Label>
                  <Select onValueChange={(value) => handleInputChange('source', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qr_code">QR Code</SelectItem>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="referral">Friend/Family Referral</SelectItem>
                      <SelectItem value="walk_in">Walked by the studio</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">What interests you most?</Label>
                  <Textarea
                    id="interests"
                    rows={3}
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    placeholder="e.g., Stress relief, fitness, meditation, flexibility..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Any questions or special considerations?</Label>
                  <Textarea
                    id="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Let us know if you have any injuries, experience level, or specific goals..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Get Started"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}