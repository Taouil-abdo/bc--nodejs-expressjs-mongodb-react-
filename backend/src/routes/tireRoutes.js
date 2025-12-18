import express from 'express';
import { getAllTires, createTire, updateTire, deleteTire, getTiresNeedingReplacement } from '../controllers/tireController.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Simple tire routes
router.get('/', authenticateToken, getAllTires);
router.post('/', authenticateToken, authorizeRole(['admin']), createTire);
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateTire);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteTire);
router.get('/maintenance-needed', authenticateToken, authorizeRole(['admin']), getTiresNeedingReplacement);

export default router;