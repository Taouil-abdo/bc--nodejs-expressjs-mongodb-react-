import { createDriver, toggleUserStatus, getUsers, getUserById } from '../controllers/adminController.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';
import express from 'express';

const router = express.Router();

// Admin routes with proper authentication
router.post('/drivers', authenticateToken, authorizeRole(['admin']), createDriver);
router.patch('/users/:id/status', authenticateToken, authorizeRole(['admin']), toggleUserStatus);
router.get('/users', authenticateToken, authorizeRole(['admin']), getUsers);
router.get('/users/:id', authenticateToken, authorizeRole(['admin']), getUserById);

export default router;