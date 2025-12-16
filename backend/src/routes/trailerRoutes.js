import express from 'express';
import { getAllTrailers, createTrailer, updateTrailer, deleteTrailer } from '../controllers/trailerController.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Simple trailer routes
router.get('/', authenticateToken, getAllTrailers);
router.post('/', authenticateToken, authorizeRole(['admin']), createTrailer);
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateTrailer);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteTrailer);

export default router;