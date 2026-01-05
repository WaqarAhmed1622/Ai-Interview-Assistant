/**
 * Admin Management Page
 *
 * Displays list of admin users with ability to revoke admin privileges.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../lib/services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, ShieldOff, ArrowLeft, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface AdminUser {
    id: string;
    email: string;
    full_name: string | null;
    role: 'user' | 'admin';
    created_at: string;
}

export function AdminAdminsPage() {
    const { user: currentUser } = useAuth();
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    
    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Visibility toggle
    const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    });

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const users = await adminService.getUsers();
            // Filter only admins
            const adminUsers = users.filter(u => u.role === 'admin');
            setAdmins(adminUsers);
        } catch (err) {
            console.error('Failed to fetch admins:', err);
            setError('Failed to load admin users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const resetForm = () => {
        setFormData({ email: '', password: '', fullName: '' });
        setError(null);
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setActionLoading('add');

        try {
            await adminService.createAdmin(formData.email, formData.password, formData.fullName);
            await fetchAdmins();
            setShowAddModal(false);
            resetForm();
        } catch (err: any) {
            console.error('Failed to create admin:', err);
            setError(err.message || 'Failed to create admin user.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleEditAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAdmin) return;
        
        setError(null);
        setActionLoading('edit');

        try {
            // 1. Update Profile (Name)
            if (formData.fullName !== selectedAdmin.full_name) {
                await adminService.updateAdminProfile(selectedAdmin.id, { full_name: formData.fullName });
            }

            // 2. Update Password (if provided)
            if (formData.password && formData.password.trim().length > 0) {
                if (formData.password.length < 6) {
                    throw new Error('Password must be at least 6 characters.');
                }
                await adminService.updateAdminPassword(selectedAdmin.id, formData.password);
            }

            await fetchAdmins();
            setShowEditModal(false);
            resetForm();
            setSelectedAdmin(null);
        } catch (err: any) {
            console.error('Failed to update admin:', err);
            setError(err.message || 'Failed to update admin user.');
        } finally {
            setActionLoading(null);
        }
    };

    const openEditModal = (admin: AdminUser) => {
        setSelectedAdmin(admin);
        setFormData({
            email: admin.email, // Read only
            password: '', // Empty initially (user enters only if they want to change)
            fullName: admin.full_name || ''
        });
        setShowEditModal(true);
    };

    const handleRevokeAdmin = async (userId: string) => {
        if (userId === currentUser?.id) {
            if (!window.confirm('Warning: You are about to account DELETE YOUR OWN ACCOUNT. You will be logged out immediately. This cannot be undone. Are you sure?')) {
                return;
            }
        } else {
            if (!window.confirm('Are you sure you want to permanently DELETE this admin user? This will remove their account and allow the email to be reused. This cannot be undone.')) {
                return;
            }
        }

        try {
            setActionLoading(userId);
            // TRUE DELETE implemented via RPC
            await adminService.deleteUser(userId);
            
            // Remove from list
            setAdmins(prev => prev.filter(a => a.id !== userId));
            
            // If revoking self, redirect (user is deleted so session invalid)
            if (userId === currentUser?.id) {
                window.location.href = '/login';
            }
        } catch (err) {
            console.error('Failed to delete admin:', err);
            alert('Failed to delete admin user.');
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
                        <h1 className="text-2xl font-bold text-white">Admin Management</h1>
                    </div>
                    <p className="text-slate-400 ml-11">Manage administrator accounts</p>
                </div>
                <div className="flex gap-3">
                     <button 
                        onClick={() => { resetForm(); setShowAddModal(true); }}
                        className="bg-primary hover:bg-primary/90 text-background px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Add New Admin
                    </button>
                    <div className="bg-purple-500/10 text-purple-400 px-4 py-2 rounded-lg text-sm border border-purple-500/20 flex items-center">
                        Total: <strong>{admins.length}</strong>
                    </div>
                </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-amber-400 font-medium">Important</p>
                    <p className="text-amber-400/80 text-sm mt-1">
                        Revoking admin privileges is immediate. To delete a user completely, use the database console. Revoking here removes their admin access.
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/20">
                    {error}
                </div>
            )}

            {/* Admins List */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 border-b border-slate-700">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Admin</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Admin Since</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {admins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                                                {admin.full_name ? admin.full_name[0].toUpperCase() : admin.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white flex items-center gap-2">
                                                    {admin.full_name || 'No Name'}
                                                    {admin.id === currentUser?.id && (
                                                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">You</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-slate-400">{admin.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            Active Admin
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {new Date(admin.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(admin)}
                                                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
                                                title="Edit Details"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleRevokeAdmin(admin.id)}
                                                disabled={actionLoading === admin.id}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {actionLoading === admin.id ? (
                                                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                                ) : (
                                                    <ShieldOff className="w-4 h-4" />
                                                )}
                                                Revoke
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {admins.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        No admin users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Admin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Admin</h2>
                        <form onSubmit={handleAddAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary pr-10"
                                        placeholder="••••••••"
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
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading === 'add'}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-background px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex justify-center"
                                >
                                    {actionLoading === 'add' ? (
                                        <span className="w-5 h-5 border-2 border-background/20 border-t-background rounded-full animate-spin"></span>
                                    ) : 'Create Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Admin Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Edit Admin</h2>
                        <form onSubmit={handleEditAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    disabled
                                    value={formData.email}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary placeholder-slate-600 pr-10"
                                        placeholder="Leave blank to keep current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Min 6 chars. Only enter if changing.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    placeholder="John Doe"
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading === 'edit'}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-background px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex justify-center"
                                >
                                    {actionLoading === 'edit' ? (
                                        <span className="w-5 h-5 border-2 border-background/20 border-t-background rounded-full animate-spin"></span>
                                    ) : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminAdminsPage;
