import User from '../models/User.model.js';
import Resource from '../models/Resource.model.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResources = await Resource.countDocuments();

    res.json({
      totalUsers,
      totalResources,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all resources for admin table
// @route   GET /api/admin/resources
// @access  Private/Admin
export const getAdminResources = async (req, res) => {
  try {
    const resources = await Resource.find({}).populate('uploader', 'name email');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
