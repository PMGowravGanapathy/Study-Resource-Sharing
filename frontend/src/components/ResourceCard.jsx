import { FileText, Link as LinkIcon, Download, ExternalLink, ThumbsUp, Calendar } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function ResourceCard({ resource, onLikeUpdate }) {
  const { user, isAuthenticated } = useAuthStore();
  const [isLiking, setIsLiking] = useState(false);
  const [likes, setLikes] = useState(resource.likes || []);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like resources');
      return;
    }
    
    setIsLiking(true);
    try {
      const { data } = await api.put(`/resources/${resource._id}/like`);
      setLikes(data);
      if (onLikeUpdate) onLikeUpdate(resource._id, data);
    } catch (error) {
      toast.error('Failed to like resource');
    } finally {
      setIsLiking(false);
    }
  };

  const isLiked = user ? likes.includes(user._id) : false;
  const isLink = resource.type === 'Link';

  return (
    <div className="card flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-primary-900/30 text-primary-400 text-xs font-semibold px-2.5 py-1 rounded-full">
          {resource.subject}
        </div>
        <div className="flex items-center space-x-1 text-slate-400">
          {isLink ? <LinkIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
          <span className="text-xs uppercase font-medium">{resource.type}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
        {resource.title}
      </h3>
      <p className="text-slate-400 text-sm mb-4 flex-1 line-clamp-3">
        {resource.description}
      </p>

      <div className="mt-auto border-t border-dark-border pt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-slate-500 flex flex-col">
            <span className="text-slate-300 font-medium mb-0.5">{resource.uploader?.name || 'Unknown User'}</span>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(resource.createdAt).toLocaleDateString()}
            </span>
          </div>
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
              isLiked ? 'text-primary-400 bg-primary-400/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-primary-400' : ''}`} />
            <span className="text-sm font-medium">{likes.length}</span>
          </button>
        </div>

        <div className="flex gap-2">
          {isLink ? (
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary w-full flex items-center justify-center space-x-2 text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Link</span>
            </a>
          ) : (
            <a 
              href={`http://localhost:5000${resource.url}`} 
              target="_blank"
              download
              className="btn-primary w-full flex items-center justify-center space-x-2 text-sm"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
