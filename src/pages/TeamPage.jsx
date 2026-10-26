import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShieldCheck,
  UserPlus,
  Shield,
  User,
  Loader2,
  Calendar,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Settings,
  ShieldAlert,
  UserCheck,
  UserX,
} from 'lucide-react';
import {
  getTeamMembersApi,
  inviteTeamMemberApi,
  updateUserRoleApi,
  toggleUserStatusApi,
} from '../services/users.api';
import { setCredentials } from '../features/auth/authSlice';
import InviteMemberModal from '../components/team/InviteMemberModal';
import EditRoleModal from '../components/team/EditRoleModal';
import UserProfileModal from '../components/team/UserProfileModal';

export default function TeamPage() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === 'Admin';

  // Modals state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Fetch Team Members
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['team'],
    queryFn: getTeamMembersApi,
  });

  const members = data?.data?.members || [];

  // Invite Mutation
  const inviteMutation = useMutation({
    mutationFn: inviteTeamMemberApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      setIsInviteModalOpen(false);
      setInviteError('');
    },
    onError: (err) => {
      setInviteError(err.response?.data?.message || 'Failed to invite team member');
    },
  });

  // Role Update Mutation
  const roleMutation = useMutation({
    mutationFn: updateUserRoleApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      setEditingMember(null);
      // If updating self, update Redux store
      if (res?.data?.user && res.data.user._id === user?._id) {
        dispatch(setCredentials({ user: res.data.user }));
      }
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update member role');
    },
  });

  // Toggle Status Mutation
  const statusMutation = useMutation({
    mutationFn: toggleUserStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update member status');
    },
  });

  const handleOpenInvite = () => {
    setInviteError('');
    setIsInviteModalOpen(true);
  };

  const handleInviteSubmit = (payload) => {
    inviteMutation.mutate(payload);
  };

  const handleRoleSubmit = ({ id, role }) => {
    roleMutation.mutate({ id, role });
  };

  const handleToggleStatus = (member) => {
    if (member._id === user?._id) {
      alert('You cannot deactivate your own account');
      return;
    }
    const action = member.isActive ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} ${member.name}'s account?`)) {
      statusMutation.mutate(member._id);
    }
  };

  const handleProfileUpdated = (updatedUser) => {
    dispatch(setCredentials({ user: updatedUser }));
    queryClient.invalidateQueries({ queryKey: ['team'] });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Team & Permissions
            </h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {members.length} members
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Administer workspace user accounts, role authorizations, and account active states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* My Profile Button */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span>My Profile</span>
          </button>

          {/* Invite Member Button (Admin only) */}
          {isAdmin ? (
            <button
              onClick={handleOpenInvite}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Invite Member</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Admin Role Required to Invite</span>
            </div>
          )}
        </div>
      </div>

      {/* Role Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-indigo-700">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-semibold text-sm">Admin</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Full workspace privileges: manage team accounts, change roles, activate/deactivate accounts, manage all customers, products, and orders.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-700">
            <Shield className="h-5 w-5" />
            <span className="font-semibold text-sm">Analyst</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Operational privileges: view analytics, create & update customers, products, and orders. Cannot manage or alter team member accounts.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-700">
            <User className="h-5 w-5" />
            <span className="font-semibold text-sm">Viewer</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Read-only privileges: view analytics, reports, and business records. Cannot create, edit, archive, or cancel any records.
          </p>
        </div>
      </div>

      {/* Team Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="py-3.5 px-6">Member</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date Added</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500 mb-2" />
                    <span className="text-xs">Loading team roster...</span>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-rose-500 text-xs">
                    {error?.response?.data?.message || 'Error loading team'}
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    No team members found
                  </td>
                </tr>
              ) : (
                members.map((member) => {
                  const isSelf = member._id === user?._id;
                  const dateAdded = new Date(member.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={member._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{member.name}</span>
                          {isSelf && (
                            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">{member.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                            member.role === 'Admin'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/50'
                              : member.role === 'Analyst'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/50'
                              : 'bg-slate-100 text-slate-700 border border-slate-200/50'
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {member.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                            Deactivated
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {dateAdded}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {isAdmin ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingMember(member)}
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                            >
                              Edit Role
                            </button>
                            <button
                              onClick={() => handleToggleStatus(member)}
                              disabled={isSelf || statusMutation.isPending}
                              className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                                isSelf
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : member.isActive
                                  ? 'text-rose-600 hover:bg-rose-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={isSelf ? 'Cannot deactivate self' : ''}
                            >
                              {member.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Read-only</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-xs text-slate-500">
          <span>Authorized workspace team members and permissions</span>
          <span>Workspace: Acme Retail Corp</span>
        </div>
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSubmit={handleInviteSubmit}
        isSubmitting={inviteMutation.isPending}
        error={inviteError}
      />

      {/* Edit Role Modal */}
      <EditRoleModal
        isOpen={Boolean(editingMember)}
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onSubmit={handleRoleSubmit}
        isSubmitting={roleMutation.isPending}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        user={user}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}
