/**
 * Admin Users Page
 *
 * Displays all users with search, filter, and role management.
 * Dark theme styling for admin portal.
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../lib/services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Search, ArrowLeft, Filter } from 'lucide-react';

interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    role: 'user' | 'admin';
    created_at: string;
}

export function AdminUsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filtered users based on search and role
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch = searchQuery === '' ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
            
            const matchesRole = roleFilter === 'all' || u.role === roleFilter;
            
            return matchesSearch && matchesRole;
        });
    }, [users, searchQuery, roleFilter]);

    const handleToggleRole = async (userId: string, currentRole: 'user' | 'admin') => {
        if (userId === currentUser?.id) {
            if (!window.confirm('Warning: You are about to remove your own admin privileges. You will lose access to this page immediately. Are you sure?')) {
                return;
            }
        }

        try {
            setActionLoading(userId);
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            await adminService.updateUserRole(userId, newRole);

            // Optimistic update
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, role: newRole } : u
            ));
        } catch (err) {
            console.error('Failed to update role:', err);
            alert('Failed to update user role.');
        } finally {
            setActionLoading(null);
        }
    };

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
                        <h1 className="text-2xl font-bold text-white">User Management</h1>
                    </div>
                    <p className="text-slate-400 ml-11">Manage user roles and permissions</p>
                </div>
                <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg text-sm border border-blue-500/20">
                    <Users className="w-4 h-4 inline mr-2" />
                    Total Users: <strong>{users.length}</strong>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'admin')}
                        className="pl-10 pr-8 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Users Only</option>
                        <option value="admin">Admins Only</option>
                    </select>
                </div>
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
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Role</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Joined</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
                                                {u.full_name ? u.full_name[0].toUpperCase() : u.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white flex items-center gap-2">
                                                    {u.full_name || 'No Name'}
                                                    {u.id === currentUser?.id && (
                                                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">You</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-slate-400">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${u.role === 'admin'
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                : 'bg-slate-700 text-slate-300 border-slate-600'
                                            }`}>
                                            {u.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleToggleRole(u.id, u.role)}
                                            disabled={actionLoading === u.id}
                                            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${u.role === 'admin'
                                                    ? 'text-red-400 hover:bg-red-500/10'
                                                    : 'text-primary hover:bg-primary/10'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {actionLoading === u.id ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                                    Updating...
                                                </span>
                                            ) : (
                                                u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        {searchQuery || roleFilter !== 'all' 
                                            ? 'No users match your search criteria.' 
                                            : 'No users found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminUsersPage;
