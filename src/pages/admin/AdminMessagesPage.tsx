
import { useState, useEffect } from 'react';
import { adminService } from '../../lib/services/adminService';
import { Mail, Search, Trash2, X } from 'lucide-react';

interface ContactMessage {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    subject: string;
    message: string;
    status: 'read' | 'unread';
    created_at: string;
}

export function AdminMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await adminService.getContactMessages();
            setMessages(data);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm('Delete this message?')) return;
        try {
            await adminService.deleteMessage(id);
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (err) {
            console.error('Failed to delete message:', err);
        }
    };

    const handleView = async (message: ContactMessage) => {
        setSelectedMessage(message);
        // Mark as read if unread
        if (message.status === 'unread') {
            try {
                await adminService.updateMessageStatus(message.id, 'read');
                setMessages(prev => prev.map(m => 
                    m.id === message.id ? { ...m, status: 'read' } : m
                ));
            } catch (err) {
                console.error('Failed to mark read:', err);
            }
        }
    };

    const filteredMessages = messages.filter(m => 
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Messages</h1>
                    <p className="text-slate-400">View and manage contact form submissions.</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            {/* Messages List */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading messages...</div>
                ) : filteredMessages.length > 0 ? (
                    <div className="divide-y divide-slate-800">
                        {filteredMessages.map(msg => (
                            <div 
                                key={msg.id}
                                onClick={() => handleView(msg)}
                                className={`p-4 flex items-center gap-4 hover:bg-slate-800/50 cursor-pointer transition-colors ${
                                    msg.status === 'unread' ? 'bg-slate-800/20' : ''
                                }`}
                            >
                                <div className={`w-2 h-2 rounded-full shrink-0 ${
                                    msg.status === 'unread' ? 'bg-primary' : 'bg-transparent'
                                }`} />
                                
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`text-sm font-medium truncate ${
                                            msg.status === 'unread' ? 'text-white' : 'text-slate-300'
                                        }`}>
                                            {msg.first_name} {msg.last_name}
                                        </h3>
                                        <span className="text-xs text-slate-500">
                                            {new Date(msg.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate ${
                                        msg.status === 'unread' ? 'text-slate-200' : 'text-slate-500'
                                    }`}>
                                        <span className="font-medium">{msg.subject}</span> - {msg.message}
                                    </p>
                                </div>

                                <button 
                                    onClick={(e) => handleDelete(e, msg.id)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No messages found.</p>
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedMessage(null)}>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">{selectedMessage.subject}</h2>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <span>{selectedMessage.first_name} {selectedMessage.last_name}</span>
                                    <span>&bull;</span>
                                    <span>&lt;{selectedMessage.email}&gt;</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedMessage(null)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {selectedMessage.message}
                        </div>

                        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between text-sm">
                            <span className="text-slate-500">
                                Sent on {new Date(selectedMessage.created_at).toLocaleString()}
                            </span>
                            <div className="flex gap-3">
                                <a 
                                    href={`mailto:${selectedMessage.email}`}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                                >
                                    Reply via Email
                                </a>
                                <button
                                    onClick={(e) => {
                                        handleDelete(e as any, selectedMessage.id);
                                        setSelectedMessage(null);
                                    }}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
