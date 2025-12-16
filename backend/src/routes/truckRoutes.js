import express from 'express';
import { getAllTrucks, createTruck, updateTruck, deleteTruck } from '../controllers/truckController.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllTrucks);                    
router.post('/', authenticateToken, authorizeRole(['admin']), createTruck);     
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateTruck);   
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteTruck); 

export default router;