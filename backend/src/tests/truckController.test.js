import { getAllTrucks, createTruck, updateTruck, deleteTruck } from '../controllers/truckController.js';
import Truck from '../models/truck.js';
import * as truckService from '../services/truckService.js';

// Mock the Truck model
jest.mock('../models/truck.js');
// We don't need to mock truckService if we mock the model correctly, 
// but mocking truckService might be cleaner for unit testing the controller.
// However, let's stick to mocking the model as the original test tried to do, 
// but fix the static methods.

describe('Truck Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('getAllTrucks', () => {
        it('should return all trucks successfully', async () => {
            const mockTrucks = [{ _id: '1', immatriculation: 'ABC123' }];
            Truck.find.mockResolvedValue(mockTrucks);

            await getAllTrucks(req, res);

            expect(Truck.find).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockTrucks);
        });

        it('should handle error', async () => {
            Truck.find.mockRejectedValue(new Error('Database error'));

            await getAllTrucks(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('createTruck', () => {
        it('should create a new truck successfully', async () => {
            const truckData = {
                immatriculation: 'NEW123',
                marque: 'Volvo',
                kilometrageActuel: 50000
            };
            req.body = truckData;

            const mockSavedTruck = { _id: 'new123', ...truckData };

            // Mock Truck.findOne to return null (no duplicate)
            Truck.findOne.mockResolvedValue(null);
            // Mock Truck.create to return the new truck
            Truck.create.mockResolvedValue(mockSavedTruck);

            await createTruck(req, res);

            expect(Truck.findOne).toHaveBeenCalledWith({ immatriculation: truckData.immatriculation });
            expect(Truck.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'truck created with success',
                ...mockSavedTruck
            }));
        });

        it('should handle validation error', async () => {
            req.body = { immatriculation: 'INVALID' };
            Truck.findOne.mockResolvedValue(null);
            Truck.create.mockRejectedValue(new Error('Validation error'));

            await createTruck(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
        });
    });

    describe('updateTruck', () => {
        it('should update truck successfully', async () => {
            req.params.id = '123';
            req.body = { kilometrageActuel: 60000 };
            const updatedTruck = { _id: '123', ...req.body };

            Truck.findByIdAndUpdate.mockResolvedValue(updatedTruck);

            await updateTruck(req, res);

            expect(Truck.findByIdAndUpdate).toHaveBeenCalledWith('123', req.body, { new: true });
            expect(res.json).toHaveBeenCalledWith(updatedTruck);
        });
    });

    describe('deleteTruck', () => {
        it('should delete truck successfully', async () => {
            req.params.id = '123';
            // Mock findById for service check
            Truck.findById.mockResolvedValue({ _id: '123', status: 'available' });
            // Mock findByIdAndDelete
            Truck.findByIdAndDelete.mockResolvedValue({ _id: '123' });

            await deleteTruck(req, res);

            expect(Truck.findByIdAndDelete).toHaveBeenCalledWith('123');
            expect(res.json).toHaveBeenCalledWith({ message: 'Truck deleted successfully' });
        });
    });
});