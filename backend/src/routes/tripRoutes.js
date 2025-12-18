import express from 'express';
import { getAllTrips, createTrip, updateTrip, deleteTrip, getAllDrivers } from '../controllers/tripController.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Simple trip routes for admin
router.get('/', authenticateToken, getAllTrips);                                    
router.post('/', authenticateToken, authorizeRole(['admin']), createTrip);          
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateTrip);        
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteTrip);     
router.get('/drivers', authenticateToken, authorizeRole(['admin']), getAllDrivers); 

export default router;