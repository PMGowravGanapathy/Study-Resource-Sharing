import { useState, useEffect } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import api from '../services/api';
import ResourceCard from '../components/ResourceCard';
import toast from 'react-hot-toast';

const SUBJECTS = [
  'All',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Literature',
  'History',
  'Other'
];

export default function Home() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let query = `?page=1&limit=50`;
      if (debouncedSearch) query += `&search=${encodeURIComponent(debouncedSearch)}`;
      if (subjectFilter !== 'All') query += `&subject=${encodeURIComponent(subjectFilter)}`;

      const { data } = await api.get(`/resources${query}`);
      setResources(data.resources);
    } catch (error) {
      toast.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [debouncedSearch, subjectFilter]);

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col items-center text-center space-y-4 mb-10 mt-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Discover <span className="text-primary-500">Study Materials</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Access high-quality study notes, PDFs, and useful links shared by students and professors.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 bg-dark-surface p-4 rounded-xl border border-dark-border">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title or description..."
            className="input-field pl-10 bg-slate-900/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-slate-400" />
          </div>
          <select
            className="input-field pl-10 appearance-none bg-slate-900/50 cursor-pointer"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            {SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-dark-surface/50 rounded-xl border border-dashed border-dark-border">
          <FileText className="h-12 w-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-xl font-medium text-white mb-1">No resources found</h3>
          <p className="text-slate-400">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}

// Just importing this below to use in the empty state
import { FileText } from 'lucide-react';
