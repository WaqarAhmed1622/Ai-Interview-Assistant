/**
 * Admin Users Page
 *
 * Displays all registered service users (excludes admins).
 * Admins are managed separately on /admin/admins.
 * Dark theme styling for admin portal.
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../lib/services/adminService';
import { Users, Search, ArrowLeft, Lock, Unlock, KeyRound, Eye, EyeOff, X } from 'lucide-react';

interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    created_at: string;
    banned_until: string | null;
}

export function AdminUsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Action State
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    
    // Reset Password Modal
    const [showResetModal, setShowResetModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getRegisteredUsers();
            // Data now includes banned_until from RPC
            // Remove manual filter since RPC already filters, but safe to keep check or just cast
            setUsers(data as any as UserProfile[]);
        } catch (err: any) {
            console.error('Failed to fetch users:', err);
            setError(err.message || 'Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleBan = async (user: UserProfile) => {
        const isBanned = !!user.banned_until && new Date(user.banned_until) > new Date();
        const action = isBanned ? 'unlock' : 'lock';
        
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            setActionLoading(user.id);
            // Ban until year 3000 effectively locks it, null unlocks it
            const banUntil = isBanned ? null : '3000-01-01T00:00:00Z';
            await adminService.toggleUserBan(user.id, banUntil);
            
            // Optimistic update or refresh
            await fetchUsers();
        } catch (err) {
            console.error('Failed to toggle ban:', err);
            alert(`Failed to ${action} user.`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            setActionLoading('reset'); // using string literal for modal loader
            await adminService.updateAdminPassword(selectedUser.id, newPassword);
            setShowResetModal(false);
            setNewPassword('');
            setSelectedUser(null);
            alert('Password reset successfully.');
        } catch (err: any) {
            console.error('Failed to reset password:', err);
            alert('Failed to reset password: ' + (err.message || 'Unknown error'));
        } finally {
            setActionLoading(null);
        }
    };

    const openResetModal = (user: UserProfile) => {
        setSelectedUser(user);
        setNewPassword('');
        setShowResetModal(true);
    };

    // Filtered users based on search
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            return searchQuery === '' ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        });
    }, [users, searchQuery]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link 
                            to="/admin/dashboard" 
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-bold text-white">Registered Users</h1>
                    </div>
                    <p className="text-slate-400 ml-11">View all registered service users</p>
                </div>
                <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg text-sm border border-blue-500/20">
                    <Users className="w-4 h-4 inline mr-2" />
                    Total Users: <strong>{users.length}</strong>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
            </div>

            {error && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/20">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 border-b border-slate-700">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">User</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Email</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Joined</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredUsers.map((u) => {
                                const isBanned = !!u.banned_until && new Date(u.banned_until) > new Date();
                                return (
                                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
                                                    {u.full_name ? u.full_name[0].toUpperCase() : u.email[0].toUpperCase()}
                                                </div>
                                                <div className="font-medium text-white">
                                                    {u.full_name || 'No Name'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {u.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isBanned ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                    <Lock className="w-3 h-3" />
                                                    Locked
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openResetModal(u)}
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Reset Password"
                                                >
                                                    <KeyRound className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleBan(u)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        isBanned 
                                                            ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10' 
                                                            : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                                                    }`}
                                                    title={isBanned ? "Unlock User" : "Lock User"}
                                                    disabled={actionLoading === u.id}
                                                >
                                                    {actionLoading === u.id ? (
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : isBanned ? (
                                                        <Unlock className="w-4 h-4" />
                                                    ) : (
                                                        <Lock className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        {searchQuery 
                                            ? 'No users match your search criteria.' 
                                            : 'No users found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Reset Password Modal */}
                {showResetModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Reset Password</h2>
                                <button 
                                    onClick={() => setShowResetModal(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                <div className="text-sm text-slate-400 mb-1">Reseting password for:</div>
                                <div className="font-medium text-white break-all">{selectedUser.email}</div>
                            </div>

                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            minLength={6}
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary pr-10"
                                            placeholder="Enter new password..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Must be at least 6 characters</p>
                                </div>

                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowResetModal(false)}
                                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading === 'reset'}
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {actionLoading === 'reset' ? 'Reseting...' : 'Reset Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUsersPage;
