import api from './api';

/**
 * Fetch all team members in workspace
 */
export const getTeamMembersApi = async () => {
  const response = await api.get('/users');
  return response.data;
};

/**
 * Invite a new team member to workspace
 */
export const inviteTeamMemberApi = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

/**
 * Update a team member's role
 */
export const updateUserRoleApi = async ({ id, role }) => {
  const response = await api.patch(`/users/${id}/role`, { role });
  return response.data;
};

/**
 * Toggle member active status (activate/deactivate)
 */
export const toggleUserStatusApi = async (id) => {
  const response = await api.patch(`/users/${id}/status`);
  return response.data;
};

/**
 * Fetch current user profile
 */
export const getUserProfileApi = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

/**
 * Update current user profile (name or password)
 */
export const updateUserProfileApi = async (profileData) => {
  const response = await api.patch('/users/profile', profileData);
  return response.data;
};
