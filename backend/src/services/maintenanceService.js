import Maintenance from '../models/maintenance.js';
import Truck from '../models/truck.js';
import Trailer from '../models/trailer.js';

// Check if maintenance is needed based on kilometrage or date
export const checkMaintenanceNeeded = async (vehicleId, vehicleType) => {
    try {
        const vehicle = vehicleType === 'Truck' 
            ? await Truck.findById(vehicleId) 
            : await Trailer.findById(vehicleId);

        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        const alerts = [];

        // For trucks, check oil change (every 15,000 km or 6 months)
        if (vehicleType === 'Truck') {
            const kmSinceLastOilChange = vehicle.kilometrageActuel - (vehicle.lastOilChangeKm || 0);
            const daysSinceLastOilChange = Math.floor((Date.now() - new Date(vehicle.derniereVidange)) / (1000 * 60 * 60 * 24));

            if (kmSinceLastOilChange >= 15000 || daysSinceLastOilChange >= 180) {
                alerts.push({
                    type: 'oil-change',
                    message: 'Oil change needed',
                    urgency: kmSinceLastOilChange >= 18000 || daysSinceLastOilChange >= 210 ? 'high' : 'medium'
                });
            }

            // Check revision (every 30,000 km or 12 months)
            const daysSinceLastRevision = Math.floor((Date.now() - new Date(vehicle.derniereRevision)) / (1000 * 60 * 60 * 24));
            if (daysSinceLastRevision >= 365) {
                alerts.push({
                    type: 'inspection',
                    message: 'Annual inspection needed',
                    urgency: daysSinceLastRevision >= 400 ? 'high' : 'medium'
                });
            }
        }

        return alerts;
    } catch (error) {
        throw error;
    }
};

// Get all vehicles needing maintenance
export const getVehiclesNeedingMaintenance = async () => {
    try {
        const trucks = await Truck.find();
        const maintenanceNeeded = [];

        for (const truck of trucks) {
            const alerts = await checkMaintenanceNeeded(truck._id, 'Truck');
            if (alerts.length > 0) {
                maintenanceNeeded.push({
                    vehicle: truck,
                    vehicleType: 'Truck',
                    alerts
                });
            }
        }

        return maintenanceNeeded;
    } catch (error) {
        throw error;
    }
};

// Create maintenance schedule
export const createMaintenanceSchedule = async (data) => {
    try {
        const maintenance = new Maintenance(data);
        await maintenance.save();
        return maintenance;
    } catch (error) {
        throw error;
    }
};

// Complete maintenance and update vehicle
export const completeMaintenance = async (maintenanceId, completionData) => {
    try {
        const maintenance = await Maintenance.findById(maintenanceId);
        if (!maintenance) {
            throw new Error('Maintenance record not found');
        }

        // Update maintenance record
        maintenance.status = 'completed';
        maintenance.completedDate = completionData.completedDate || Date.now();
        maintenance.cost = completionData.cost;
        maintenance.notes = completionData.notes;
        await maintenance.save();

        // Update vehicle maintenance dates
        if (maintenance.targetModel === 'Truck') {
            const updateData = {};
            if (maintenance.maintenanceType === 'oil-change') {
                updateData.derniereVidange = maintenance.completedDate;
                updateData.lastOilChangeKm = completionData.currentKm;
            } else if (maintenance.maintenanceType === 'inspection') {
                updateData.derniereRevision = maintenance.completedDate;
            }
            
            if (Object.keys(updateData).length > 0) {
                await Truck.findByIdAndUpdate(maintenance.targetId, updateData);
            }
        }

        return maintenance;
    } catch (error) {
        throw error;
    }
};

// Get upcoming maintenance
export const getUpcomingMaintenance = async () => {
    try {
        const upcoming = await Maintenance.find({
            status: 'scheduled',
            scheduledDate: { $gte: Date.now(), $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
        }).populate('targetId');
        
        return upcoming;
    } catch (error) {
        throw error;
    }
};
