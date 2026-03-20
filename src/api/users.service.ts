/**
 * Users Service (non-admin)
 * Fetches users list for dropdowns
 */

import { apiRequest } from '@/lib/api.client';
import { User } from '@/types/user';

export interface UsersDropdownResponse {
  data: User[];
}

export const usersService = {
  /**
   * Get all users for dropdown purposes (requires auth)
   */
  list: (): Promise<UsersDropdownResponse> =>
    apiRequest.get('/users').then((response: any) => ({
      data: Array.isArray(response?.data) ? response.data : [],
    })),
};
