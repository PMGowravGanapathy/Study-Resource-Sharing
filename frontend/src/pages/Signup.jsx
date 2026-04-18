import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', formData);
      login(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full pt-10">
      <div className="card w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Join StudyVault</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
            <input
              type="text"
              name="department"
              required
              className="input-field"
              value={formData.department}
              onChange={handleChange}
              placeholder="Computer Science"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex justify-center py-2.5 mt-2"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
