
import { apiClient } from '@/lib/api.client';


export async function predictTimeline(projectId: string, projectTitle: string, tasks: any[]) {
  const { data } = await apiClient.post(`/ai/timeline-predict`, {
    projectId,
    projectTitle,
    tasks,
  });
  return data;
}


export async function suggestTasks(prompt: string) {
  const { data } = await apiClient.post(`/ai/task-suggest`, { prompt });
  return data;
}


export async function bulkCreateTasks(projectId: string, tasks: any[]) {
  const { data } = await apiClient.post(`/tasks/bulk`, { projectId, tasks });
  return data;
}
