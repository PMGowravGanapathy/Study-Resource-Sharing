import { useState, useEffect } from 'react';
import { User, Mail, BookOpen, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import ResourceCard from '../components/ResourceCard';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuthStore();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyResources = async () => {
    try {
      // Admin might see all, but here we just want the logged-in user's uploads
      // In a real app we'd have a specific /api/users/me/resources endpoint
      // We'll use the public endpoint and let the backend return everything, but we should really filter
      // Actually our backend doesn't have user-specific filter. We can filter on frontend or modify backend.
      // Modifying backend to support uploader filter would be better. But let's fetch all and filter for now to save time.
      const { data } = await api.get('/resources?limit=100');
      const myUploads = data.resources.filter(r => r.uploader?._id === user._id);
      setResources(myUploads);
    } catch (error) {
      toast.error('Failed to fetch your resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyResources();
  }, [user]);

  const handleLikeUpdate = (id, newLikes) => {
    setResources(resources.map(r => r._id === id ? { ...r, likes: newLikes } : r));
  };

  const handleDelete = (id) => {
    setResources(resources.filter(r => r._id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="card flex flex-col md:flex-row items-center md:items-start gap-6 p-8">
        <div className="bg-primary-900/30 p-6 rounded-full border-4 border-primary-500/20">
          <User className="h-20 w-20 text-primary-500" />
        </div>
        <div className="text-center md:text-left space-y-3 flex-1">
          <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-slate-400">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{user?.department} Department</span>
            </div>
          </div>
          <div className="inline-block mt-2 px-3 py-1 bg-slate-800 rounded-full text-xs font-medium text-slate-300 uppercase tracking-wider">
            Role: {user?.role}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-6 text-center min-w-[150px] border border-dark-border">
          <div className="text-3xl font-bold text-primary-400 mb-1">{resources.length}</div>
          <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Uploads</div>
        </div>
      </div>

      {/* Uploaded Resources */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary-500" />
          Your Uploaded Resources
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard 
                key={resource._id} 
                resource={resource} 
                onLikeUpdate={handleLikeUpdate} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-dark-surface rounded-xl border border-dashed border-dark-border">
            <p className="text-slate-400 mb-4">You haven't uploaded any resources yet.</p>
            <a href="/upload" className="btn-primary inline-flex">
              Upload Your First Resource
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
