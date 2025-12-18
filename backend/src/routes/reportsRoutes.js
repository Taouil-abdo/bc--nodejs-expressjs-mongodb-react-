import express from 'express';
import { 
    getFuelConsumptionReport,
    getKilometrageReport,
    getMaintenanceReport,
    getDriverPerformanceReport,
    getDashboardStats
} from '../controllers/reportsController.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Reports routes (admin only)
router.get('/fuel', authenticateToken, authorizeRole(['admin']), getFuelConsumptionReport);
router.get('/kilometrage', authenticateToken, authorizeRole(['admin']), getKilometrageReport);
router.get('/maintenance', authenticateToken, authorizeRole(['admin']), getMaintenanceReport);
router.get('/drivers', authenticateToken, authorizeRole(['admin']), getDriverPerformanceReport);
router.get('/dashboard', authenticateToken, authorizeRole(['admin']), getDashboardStats);

export default router;