import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link as LinkIcon, FileText, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const SUBJECTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Literature',
  'History',
  'Other'
];

export default function UploadResource() {
  const [type, setType] = useState('PDF');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type !== 'Link' && !file) {
      toast.error('Please select a file to upload');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('description', description);
      formData.append('type', type);

      if (type === 'Link') {
        formData.append('linkUrl', linkUrl);
      } else {
        formData.append('file', file);
      }

      await api.post('/resources', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      toast.success('Resource uploaded successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Resource</h1>
        <p className="text-slate-400">Share your study materials with the community.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resource Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">Resource Type</label>
            <div className="grid grid-cols-3 gap-4">
              {['PDF', 'Note', 'Link'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex flex-col items-center justify-center py-4 px-2 rounded-lg border transition-all ${
                    type === t 
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400' 
                      : 'border-dark-border bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t === 'Link' ? <LinkIcon className="h-6 w-6 mb-2" /> : <FileText className="h-6 w-6 mb-2" />}
                  <span className="text-sm font-medium">{t}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
              <input
                type="text"
                required
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Chapter 1: Introduction to Algorithms"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Subject</label>
              <select
                className="input-field appearance-none"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
              <textarea
                required
                rows="3"
                className="input-field resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the contents of this resource..."
              />
            </div>

            {type === 'Link' ? (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">External Link URL</label>
                <input
                  type="url"
                  required
                  className="input-field"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com/resource"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">File Upload</label>
                {!file ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-dark-border hover:border-primary-500/50 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-800/30"
                  >
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-300 mb-1">Click to upload a file</p>
                    <p className="text-xs text-slate-500">PDF, DOC, TXT, MD up to 10MB</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-dark-border rounded-xl">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <FileText className="h-6 w-6 text-primary-400 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                        <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept={type === 'PDF' ? 'application/pdf' : '.txt,.doc,.docx,.md'}
                />
              </div>
            )}
          </div>

          {loading && uploadProgress > 0 && (
            <div className="w-full bg-slate-800 rounded-full h-2.5">
              <div 
                className="bg-primary-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <div className="pt-4 border-t border-dark-border">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-3"
            >
              {loading ? `Uploading... ${uploadProgress}%` : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
