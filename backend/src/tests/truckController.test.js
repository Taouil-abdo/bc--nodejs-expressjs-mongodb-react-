import { getAllTrucks, createTruck, updateTruck, deleteTruck } from '../controllers/truckController.js';
import Truck from '../models/truck.js';

// Mock the Truck model
jest.mock('../models/truck.js');

describe('Truck Controller Tests', () => {
    let req, res;

    // Set up fake request and response objects before each test
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

    // Test 1: Get all trucks
    describe('Get All Trucks', () => {
        test('should return all trucks successfully', async () => {
            // Arrange - fake truck data
            const mockTrucks = [
                { _id: '1', immatriculation: 'ABC123', marque: 'Volvo' },
                { _id: '2', immatriculation: 'XYZ789', marque: 'Mercedes' }
            ];
            Truck.find.mockResolvedValue(mockTrucks);

            // Act - call the function
            await getAllTrucks(req, res);

            // Assert - check if it worked
            expect(Truck.find).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockTrucks);
        });

        test('should handle error when getting trucks', async () => {
            // Arrange - simulate database error
            Truck.find.mockRejectedValue(new Error('Database error'));

            // Act
            await getAllTrucks(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
        });
    });

    // Test 2: Create truck
    describe('Create Truck', () => {
        test('should create a new truck successfully', async () => {
            // Arrange
            const truckData = {
                immatriculation: 'NEW123',
                marque: 'Volvo',
                modele: 'FH16',
                kilometrageActuel: 50000
            };
            req.body = truckData;

            const mockSavedTruck = { _id: 'new123', ...truckData };
            const mockTruck = {
                save: jest.fn().mockResolvedValue(mockSavedTruck)
            };
            
            // Mock the Truck constructor
            Truck.mockImplementation(() => mockTruck);

            // Act
            await createTruck(req, res);

            // Assert
            expect(mockTruck.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockSavedTruck);
        });

        test('should handle error when creating truck', async () => {
            // Arrange
            req.body = { immatriculation: 'INVALID' };
            const mockTruck = {
                save: jest.fn().mockRejectedValue(new Error('Validation error'))
            };
            Truck.mockImplementation(() => mockTruck);

            // Act
            await createTruck(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
        });
    });

    // Test 3: Update truck
    describe('Update Truck', () => {
        test('should update truck successfully', async () => {
            // Arrange
            const truckId = 'truck123';
            const updateData = { kilometrageActuel: 60000 };
            req.params.id = truckId;
            req.body = updateData;

            const updatedTruck = { _id: truckId, ...updateData };
            Truck.findByIdAndUpdate.mockResolvedValue(updatedTruck);

            // Act
            await updateTruck(req, res);

            // Assert
            expect(Truck.findByIdAndUpdate).toHaveBeenCalledWith(truckId, updateData, { new: true });
            expect(res.json).toHaveBeenCalledWith(updatedTruck);
        });

        test('should return 404 if truck not found', async () => {
            // Arrange
            req.params.id = 'nonexistent';
            req.body = { kilometrageActuel: 60000 };
            Truck.findByIdAndUpdate.mockResolvedValue(null);

            // Act
            await updateTruck(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Truck not found' });
        });
    });

    // Test 4: Delete truck
    describe('Delete Truck', () => {
        test('should delete truck successfully', async () => {
            // Arrange
            const truckId = 'truck123';
            req.params.id = truckId;
            const deletedTruck = { _id: truckId, immatriculation: 'ABC123' };
            Truck.findByIdAndDelete.mockResolvedValue(deletedTruck);

            // Act
            await deleteTruck(req, res);

            // Assert
            expect(Truck.findByIdAndDelete).toHaveBeenCalledWith(truckId);
            expect(res.json).toHaveBeenCalledWith({ message: 'Truck deleted successfully' });
        });

        test('should return 404 if truck not found for deletion', async () => {
            // Arrange
            req.params.id = 'nonexistent';
            Truck.findByIdAndDelete.mockResolvedValue(null);

            // Act
            await deleteTruck(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Truck not found' });
        });
    });
});