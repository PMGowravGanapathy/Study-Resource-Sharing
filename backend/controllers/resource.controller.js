import Resource from '../models/Resource.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private
export const createResource = async (req, res) => {
  try {
    const { title, subject, description, type, linkUrl } = req.body;

    let url = '';
    if (type === 'Link') {
      if (!linkUrl) return res.status(400).json({ message: 'Link URL is required for type Link' });
      url = linkUrl;
    } else {
      if (!req.file) return res.status(400).json({ message: 'File is required for type PDF/Note' });
      // Store relative path
      url = `/uploads/${req.file.filename}`;
    }

    const resource = await Resource.create({
      title,
      subject,
      description,
      type,
      url,
      uploader: req.user._id,
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all resources (with search & filter)
// @route   GET /api/resources
// @access  Public
export const getResources = async (req, res) => {
  try {
    const { search, subject, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (subject) {
      query.subject = subject;
    }

    const resources = await Resource.find(query)
      .populate('uploader', 'name department')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Resource.countDocuments(query);

    res.json({
      resources,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get resource by ID
// @route   GET /api/resources/:id
// @access  Public
export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('uploader', 'name department');
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user is uploader or admin
    if (resource.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this resource' });
    }

    // If it's a file, delete from local storage
    if (resource.type !== 'Link' && resource.url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', resource.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await resource.deleteOne();
    res.json({ message: 'Resource removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/Unlike a resource
// @route   PUT /api/resources/:id/like
// @access  Private
export const likeResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const index = resource.likes.indexOf(req.user._id);

    if (index === -1) {
      // Like
      resource.likes.push(req.user._id);
    } else {
      // Unlike
      resource.likes.splice(index, 1);
    }

    await resource.save();
    res.json(resource.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
