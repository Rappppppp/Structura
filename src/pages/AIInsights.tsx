import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useProjects } from '@/hooks/queries/useProjects';
import { Brain, Clock, MessageSquare, Wand2, CalendarCheck, FileCheck, BarChart3, Loader2, X, Download, Trash2, AlertCircle, TestTube } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useGenerateImage, useProjectImages, useDeleteImage } from '@/hooks/mutations/useImageGeneration';
import { imageGenerationService } from '@/api/imageGeneration.service';

const aiFeatures = [
  { icon: Wand2, title: 'Design Assistant', description: 'Create architectural design concepts using AI-assisted generation.', detail: 'Generates design concepts based on project requirements, site constraints, and style preferences.' },
];

const AIInsights = () => {
  const [selectedFeature, setSelectedFeature] = useState<typeof aiFeatures[0] | null>(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingModel, setGeneratingModel] = useState<string>('pollinations');
  const [generatingQuality, setGeneratingQuality] = useState<string>('standard');
  const [generating, setGenerating] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const { toast } = useToast();
  const { data: projectsData } = useProjects(undefined, 1, 100);

  const projects = projectsData?.data || [];
  const { mutate: saveImage } = useGenerateImage(selectedProject);
  const { data: imagesData } = useProjectImages(selectedProject, 1);
  const { mutate: deleteImage } = useDeleteImage(selectedProject);

  const models = [
    { value: 'dall-e-3', label: 'DALL-E 3 (Recommended)' },
  ];

  const qualities = [
    { value: 'standard', label: 'Standard' },
  ];

  const handleGenerateImage = async () => {
    if (!selectedProject) {
      toast({ title: 'Error', description: 'Please select a project', variant: 'destructive' });
      return;
    }

    if (!prompt.trim()) {
      toast({ title: 'Error', description: 'Please enter a design prompt', variant: 'destructive' });
      return;
    }

    setGenerating(true);
    try {
      // Generate image using OpenAI DALL-E API (server-side generation)
      console.log('🎨 Starting image generation with OpenAI DALL-E 3...');
      const savedImage = await imageGenerationService.generateWithOpenAI(selectedProject, prompt);
      
      console.log('✅ Image generated and saved successfully');
      console.log('✨ Image metadata:', {
        id: savedImage.id,
        projectId: selectedProject,
        model: 'dall-e-3',
        size: (savedImage.size_bytes / 1024).toFixed(2),
      });

      // Image is already saved by backend, just show success
      toast({
        title: 'Success',
        description: 'Design image generated and saved successfully!',
      });
      setPrompt('');
    } catch (error: unknown) {
      console.error('❌ Image generation error:', error);
      const message = error instanceof Error ? error.message : 'Image generation failed';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    deleteImage(imageId, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Image deleted successfully' });
      },
      onError: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to delete image';
        toast({ title: 'Error', description: message, variant: 'destructive' });
      },
    });
  };

  const handleTestBackendApi = async () => {
    if (!selectedProject) {
      toast({ title: 'Error', description: 'Please select a project first', variant: 'destructive' });
      return;
    }

    console.log('🧪 Testing backend API with fake image...');
    setGenerating(true);
    try {
      // Create a minimal valid test image (1x1 transparent PNG)
      const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const dataUrl = `data:image/png;base64,${testImageBase64}`;

      console.log('📤 Sending test image to backend...');
      
      await new Promise<void>((resolve, reject) => {
        saveImage(
          {
            imageData: dataUrl,
            prompt: 'TEST: Backend API verification',
            model: 'test-model',
            quality: 'test',
          },
          {
            onSuccess: (data) => {
              console.log('✅ Test passed! Backend API works:', data);
              toast({
                title: 'Success',
                description: 'Backend API is working correctly!',
              });
              resolve();
            },
            onError: (error: unknown) => {
              console.error('❌ Test failed:', error);
              const message = error instanceof Error ? error.message : 'Backend API test failed';
              toast({
                title: 'Error',
                description: `Backend test failed: ${message}`,
                variant: 'destructive',
              });
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" /> AI Insights
        </h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered tools for architecture project management</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {aiFeatures.map((feature) => (
          <div key={feature.title} className="rounded-lg border border-border bg-card p-6 animate-fade-in hover:shadow-md transition-shadow group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-card-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            <Button className="mt-4" onClick={() => setSelectedFeature(feature)}>Launch</Button>
          </div>
        ))}
      </div>

      {/* Design Assistant Dialog */}
      <Dialog open={!!selectedFeature} onOpenChange={(open) => !open && setSelectedFeature(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedFeature && <selectedFeature.icon className="h-5 w-5 text-primary" />}
              {selectedFeature?.title}
            </DialogTitle>
            <DialogDescription>{selectedFeature?.detail}</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Project Selection */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Select Project *</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                disabled={generating}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50"
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Design Prompt */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Design Prompt *</label>
              <textarea
                rows={3}
                placeholder="Describe the architectural design you want to generate. Be specific about style, features, constraints, etc."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={generating}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none disabled:opacity-50"
              />
            </div>

            {/* Model Selection */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">AI Model</label>
              <select
                value={generatingModel}
                onChange={(e) => setGeneratingModel(e.target.value)}
                disabled={generating}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50"
              >
                {models.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quality Selection */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Quality</label>
              <select
                value={generatingQuality}
                onChange={(e) => setGeneratingQuality(e.target.value)}
                disabled={generating}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50"
              >
                {qualities.map((q) => (
                  <option key={q.value} value={q.value}>
                    {q.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Generated Images */}
            {selectedProject && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowImages(!showImages)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {showImages ? 'Hide' : 'Show'} Generated Images ({imagesData?.data?.length || 0})
                </button>

                {showImages && imagesData?.data && imagesData.data.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3">
                    {imagesData.data.map((image) => (
                      <div key={image.id} className="relative group rounded-lg overflow-hidden border border-border bg-muted">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <a
                            href={image.url}
                            download
                            className="p-1 bg-primary/80 hover:bg-primary rounded-md text-white transition-colors"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="p-1 bg-destructive/80 hover:bg-destructive rounded-md text-white transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground p-2 truncate">{image.prompt}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AI Status */}
            <div className="rounded-md border border-border bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-sm text-success">
                <div className="h-2 w-2 rounded-full bg-success" />
                AI image generation ready (powered by OpenAI DALL-E)
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedFeature(null)} disabled={generating}>
              Close
            </Button>
            <Button
              variant="secondary"
              onClick={handleTestBackendApi}
              disabled={generating || !selectedProject}
              title="Test if backend API is working (uses fake image)"
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              Test API
            </Button>
            <Button 
              onClick={handleGenerateImage} 
              disabled={generating || !selectedProject || !prompt.trim()}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" /> Generate Design
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AIInsights;

