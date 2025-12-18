import { checkMaintenanceNeeded, getVehiclesNeedingMaintenance, completeMaintenance } from '../services/maintenanceService.js';
import Truck from '../models/truck.js';
import Maintenance from '../models/maintenance.js';

// Mock the models
jest.mock('../models/truck.js');
jest.mock('../models/maintenance.js');

describe('Maintenance Service Tests', () => {
    
    describe('checkMaintenanceNeeded', () => {
        it('should return oil change alert when km threshold exceeded', async () => {
            const mockTruck = {
                _id: 'truck123',
                kilometrageActuel: 20000,
                lastOilChangeKm: 0,
                derniereVidange: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
                derniereRevision: new Date()
            };

            Truck.findById.mockResolvedValue(mockTruck);

            const alerts = await checkMaintenanceNeeded('truck123', 'Truck');
            
            expect(alerts).toHaveLength(1);
            expect(alerts[0].type).toBe('oil-change');
            expect(alerts[0].urgency).toBe('high');
        });

        it('should return inspection alert when time threshold exceeded', async () => {
            const mockTruck = {
                _id: 'truck123',
                kilometrageActuel: 10000,
                lastOilChangeKm: 5000,
                derniereVidange: new Date(),
                derniereRevision: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000)
            };

            Truck.findById.mockResolvedValue(mockTruck);

            const alerts = await checkMaintenanceNeeded('truck123', 'Truck');
            
            expect(alerts.length).toBeGreaterThan(0);
            expect(alerts.some(a => a.type === 'inspection')).toBe(true);
        });

        it('should throw error if vehicle not found', async () => {
            Truck.findById.mockResolvedValue(null);

            await expect(checkMaintenanceNeeded('invalid', 'Truck'))
                .rejects.toThrow('Vehicle not found');
        });
    });

    describe('completeMaintenance', () => {
        it('should update maintenance status and vehicle data', async () => {
            const mockMaintenance = {
                _id: 'maint123',
                targetModel: 'Truck',
                targetId: 'truck123',
                maintenanceType: 'oil-change',
                status: 'scheduled',
                save: jest.fn().mockResolvedValue(true)
            };

            const completionData = {
                completedDate: new Date(),
                cost: 500,
                notes: 'Oil changed successfully',
                currentKm: 15000
            };

            Maintenance.findById.mockResolvedValue(mockMaintenance);
            Truck.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

            const result = await completeMaintenance('maint123', completionData);

            expect(mockMaintenance.status).toBe('completed');
            expect(mockMaintenance.save).toHaveBeenCalled();
            expect(Truck.findByIdAndUpdate).toHaveBeenCalledWith(
                'truck123',
                expect.objectContaining({
                    derniereVidange: completionData.completedDate,
                    lastOilChangeKm: 15000
                })
            );
        });

        it('should throw error if maintenance not found', async () => {
            Maintenance.findById.mockResolvedValue(null);

            await expect(completeMaintenance('invalid', {}))
                .rejects.toThrow('Maintenance record not found');
        });
    });
});
