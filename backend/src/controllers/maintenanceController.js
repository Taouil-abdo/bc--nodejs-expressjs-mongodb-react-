import Maintenance from '../models/maintenance.js';
import Truck from '../models/truck.js';

// Simple maintenance controller
export const getAllMaintenance = async (req, res) => {
    try {
        const maintenance = await Maintenance.find()
            .populate('truck', 'immatriculation marque modele')
            .sort({ scheduledDate: -1 });
        res.json(maintenance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createMaintenance = async (req, res) => {
    try {
        const maintenance = new Maintenance(req.body);
        await maintenance.save();
        
        // Update truck status to maintenance if scheduled
        if (maintenance.status === 'scheduled') {
            await Truck.findByIdAndUpdate(maintenance.truck, { status: 'maintenance' });
        }
        
        res.status(201).json(maintenance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateMaintenance = async (req, res) => {
    try {
        const maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!maintenance) {
            return res.status(404).json({ message: 'Maintenance not found' });
        }
        
        // Update truck status based on maintenance status
        if (maintenance.status === 'completed') {
            await Truck.findByIdAndUpdate(maintenance.truck, { 
                status: 'available',
                derniereVidange: maintenance.maintenanceType === 'oil-change' ? new Date() : undefined,
                derniereRevision: maintenance.maintenanceType === 'revision' ? new Date() : undefined
            });
        }
        
        res.json(maintenance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteMaintenance = async (req, res) => {
    try {
        const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
        if (!maintenance) {
            return res.status(404).json({ message: 'Maintenance not found' });
        }
        res.json({ message: 'Maintenance deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get trucks needing maintenance
export const getTrucksNeedingMaintenance = async (req, res) => {
    try {
        const trucks = await Truck.find();
        const needingMaintenance = [];
        
        trucks.forEach(truck => {
            const lastOilChange = new Date(truck.derniereVidange);
            const lastRevision = new Date(truck.derniereRevision);
            const now = new Date();
            
            // Check if oil change needed (every 6 months)
            const monthsSinceOilChange = (now - lastOilChange) / (1000 * 60 * 60 * 24 * 30);
            if (monthsSinceOilChange >= 6) {
                needingMaintenance.push({
                    truck: truck,
                    type: 'oil-change',
                    reason: 'Oil change needed (6+ months)'
                });
            }
            
            // Check if revision needed (every 12 months)
            const monthsSinceRevision = (now - lastRevision) / (1000 * 60 * 60 * 24 * 30);
            if (monthsSinceRevision >= 12) {
                needingMaintenance.push({
                    truck: truck,
                    type: 'revision',
                    reason: 'Annual revision needed'
                });
            }
        });
        
        res.json(needingMaintenance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};