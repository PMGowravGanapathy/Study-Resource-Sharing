import express from 'express';
import {
  createResource,
  getResources,
  getResourceById,
  deleteResource,
  likeResource,
} from '../controllers/resource.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.route('/')
  .get(getResources)
  .post(protect, upload.single('file'), createResource);

router.route('/:id')
  .get(getResourceById)
  .delete(protect, deleteResource);

router.route('/:id/like')
  .put(protect, likeResource);

export default router;
