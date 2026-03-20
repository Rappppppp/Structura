import { apiClient } from '@/lib/api.client';

export interface ProjectImage {
  id: string;
  project_id: string;
  generated_by: string;
  prompt: string;
  model: string;
  quality: string;
  path: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
  updated_at: string;
}

export const imageGenerationService = {
  /**
   * Generate an image using Craiyon API and save to backend
   */
  async generateAndSave(
    projectId: string,
    imageData: string, // base64 or data URL
    prompt: string,
    model?: string,
    quality?: string
  ) {
    console.log(`💾 Saving image to backend for project: ${projectId}`);
    console.log(`📝 Prompt: ${prompt}`);
    console.log(`📊 Image data size: ${(imageData.length / 1024).toFixed(2)}KB`);

    try {
      const response = await apiClient.post<{ data: ProjectImage }>(
        `/projects/${projectId}/images`,
        {
          image_data: imageData,
          prompt,
          model: model || 'craiyon',
          quality: quality || 'medium',
        }
      );
      
      console.log('✅ Image saved successfully:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Failed to save image to backend:', error);
      throw error;
    }
  },

  /**
   * Get all images for a project
   */
  async getProjectImages(projectId: string, page = 1) {
    const response = await apiClient.get<{
      data: ProjectImage[];
      pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
      };
    }>(`/projects/${projectId}/images?page=${page}`);
    return response.data;
  },

  /**
   * Delete an image
   */
  async deleteImage(projectId: string, imageId: string) {
    const response = await apiClient.delete(
      `/projects/${projectId}/images/${imageId}`
    );
    return response.data;
  },

  /**
   * Generate image using OpenAI DALL-E API (server-side generation)
   * Backend generates image and saves it directly
   */
  async generateWithOpenAI(
    projectId: string,
    prompt: string
  ): Promise<ProjectImage> {
    try {
      console.log(`🎨 Generating image with OpenAI DALL-E API`);
      console.log(`📝 Prompt: ${prompt}`);

      // Call backend endpoint that will handle OpenAI generation
      const response = await apiClient.post<{ data: ProjectImage }>(
        `/projects/${projectId}/images/generate`,
        { prompt }
      );

      console.log('✅ Image generated and saved successfully:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ OpenAI image generation error:', error);
      if (error instanceof Error) {
        throw new Error(`Image generation failed: ${error.message}`);
      }
      throw new Error('Image generation failed: Unknown error');
    }
  },
};
