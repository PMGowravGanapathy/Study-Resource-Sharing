import { useState, useEffect } from 'react';
import { Users, FileText, Trash2, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [stats, setStats] = useState({ totalUsers: 0, totalResources: 0 });
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resources'); // 'resources' | 'users'

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, resourcesRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/resources'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setResources(resourcesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await api.delete(`/resources/${id}`);
      toast.success('Resource deleted successfully');
      setResources(resources.filter(r => r._id !== id));
      setStats(prev => ({ ...prev, totalResources: prev.totalResources - 1 }));
    } catch (error) {
      toast.error('Failed to delete resource');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Manage platform resources and users.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card flex items-center p-6 space-x-6">
          <div className="bg-primary-900/30 p-4 rounded-full text-primary-400">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Users</p>
            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="card flex items-center p-6 space-x-6">
          <div className="bg-primary-900/30 p-4 rounded-full text-primary-400">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Resources</p>
            <p className="text-3xl font-bold text-white">{stats.totalResources}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-border">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('resources')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'resources'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
            }`}
          >
            Manage Resources
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'users'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
            }`}
          >
            Manage Users
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-dark-surface rounded-xl border border-dark-border overflow-hidden">
        {activeTab === 'resources' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark-border">
              <thead className="bg-slate-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Uploader</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {resources.map((resource) => (
                  <tr key={resource._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{resource.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{resource.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{resource.uploader?.email || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteResource(resource._id)}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {resources.length === 0 && (
              <div className="text-center py-10 text-slate-400">No resources found.</div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark-border">
              <thead className="bg-slate-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Department</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{u.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.role === 'admin' ? 'bg-primary-900/50 text-primary-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
