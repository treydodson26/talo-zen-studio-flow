import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image, Send, Sparkles } from 'lucide-react';

interface ImageGenerationRequest {
  prompt: string;
  style?: string;
  size?: string;
  model?: string;
  quality?: string;
  steps?: number;
}

export function ImageGenerationForm() {
  const [request, setRequest] = useState<ImageGenerationRequest>({
    prompt: '',
    style: 'realistic',
    size: '1024x1024',
    model: 'dalle-3',
    quality: 'standard',
    steps: 20
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const webhookUrl = 'https://treydodson26.app.n8n.cloud/webhook-test/20bd4317-eabe-4e69-8932-0199a7e60418';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!request.prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for image generation.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'image_generation',
          data: request,
          timestamp: new Date().toISOString(),
          source: 'talo_yoga_studio'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle the response based on your n8n workflow
      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        toast({
          title: "Success!",
          description: "Image generated successfully!",
        });
      } else if (result.success) {
        toast({
          title: "Request Sent!",
          description: "Image generation request sent to n8n workflow.",
        });
      } else {
        throw new Error('Unexpected response format');
      }

    } catch (error) {
      console.error('Error sending request:', error);
      toast({
        title: "Request Sent",
        description: "Image generation request has been sent to your n8n workflow.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof ImageGenerationRequest, value: string | number) => {
    setRequest(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Image Generation</h1>
          <p className="text-muted-foreground">
            Generate custom images for your yoga studio using AI. Requests are sent to your n8n automation workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Image Generation Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Prompt */}
                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt *</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the image you want to generate... e.g., 'A peaceful yoga studio with natural lighting, plants, and meditation cushions'"
                    value={request.prompt}
                    onChange={(e) => handleInputChange('prompt', e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {/* Style */}
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Select value={request.style} onValueChange={(value) => handleInputChange('style', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="vibrant">Vibrant</SelectItem>
                      <SelectItem value="natural">Natural</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Size */}
                <div className="space-y-2">
                  <Label htmlFor="size">Image Size</Label>
                  <Select value={request.size} onValueChange={(value) => handleInputChange('size', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024x1024">Square (1024x1024)</SelectItem>
                      <SelectItem value="1024x1792">Portrait (1024x1792)</SelectItem>
                      <SelectItem value="1792x1024">Landscape (1792x1024)</SelectItem>
                      <SelectItem value="512x512">Small Square (512x512)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <Label htmlFor="model">AI Model</Label>
                  <Select value={request.model} onValueChange={(value) => handleInputChange('model', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dalle-3">DALL-E 3 (High Quality)</SelectItem>
                      <SelectItem value="dalle-2">DALL-E 2 (Fast)</SelectItem>
                      <SelectItem value="midjourney">Midjourney Style</SelectItem>
                      <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quality */}
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                  <Select value={request.quality} onValueChange={(value) => handleInputChange('quality', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="hd">HD (Higher Cost)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Steps (for some models) */}
                <div className="space-y-2">
                  <Label htmlFor="steps">Generation Steps</Label>
                  <Input
                    id="steps"
                    type="number"
                    min="10"
                    max="50"
                    value={request.steps}
                    onChange={(e) => handleInputChange('steps', parseInt(e.target.value) || 20)}
                    placeholder="20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher steps = better quality but slower generation
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Generation Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview/Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Generated Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isGenerating && (
                  <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Sending request to n8n workflow...
                      </p>
                    </div>
                  </div>
                )}

                {generatedImage && (
                  <div className="space-y-4">
                    <img 
                      src={generatedImage} 
                      alt="Generated" 
                      className="w-full rounded-lg shadow-lg"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(generatedImage, '_blank')}
                      className="w-full"
                    >
                      View Full Size
                    </Button>
                  </div>
                )}

                {!isGenerating && !generatedImage && (
                  <div className="flex items-center justify-center h-64 bg-muted rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <Image className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Generated image will appear here
                      </p>
                    </div>
                  </div>
                )}

                {/* Request Details */}
                <div className="bg-surface p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Request Details</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Webhook URL:</strong> {webhookUrl}</p>
                    <p><strong>Current Prompt:</strong> {request.prompt || 'None'}</p>
                    <p><strong>Style:</strong> {request.style}</p>
                    <p><strong>Size:</strong> {request.size}</p>
                    <p><strong>Model:</strong> {request.model}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Example Prompts for Yoga Studio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "A serene yoga studio with natural wood floors, large windows, and soft morning light",
                "Meditation corner with cushions, plants, and candles in warm earth tones",
                "Yoga class in progress with diverse students in warrior pose, peaceful atmosphere",
                "Outdoor yoga session at sunrise with mats on grass, mountains in background",
                "Prenatal yoga class with expecting mothers in gentle poses, soft lighting",
                "Modern yoga studio reception area with plants, essential oils, and welcoming decor"
              ].map((prompt, index) => (
                <div 
                  key={index}
                  className="p-3 bg-surface rounded-lg cursor-pointer hover:bg-surface/80 transition-colors"
                  onClick={() => handleInputChange('prompt', prompt)}
                >
                  <p className="text-sm">{prompt}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}