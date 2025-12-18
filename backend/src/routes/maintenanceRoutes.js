import express from 'express';
import { 
    getAllMaintenance, 
    createMaintenance, 
    updateMaintenance, 
    deleteMaintenance,
    getTrucksNeedingMaintenance 
} from '../controllers/maintenanceController.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Maintenance routes
router.get('/', authenticateToken, getAllMaintenance);
router.post('/', authenticateToken, authorizeRole(['admin']), createMaintenance);
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateMaintenance);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteMaintenance);
router.get('/needed', authenticateToken, authorizeRole(['admin']), getTrucksNeedingMaintenance);

export default router;