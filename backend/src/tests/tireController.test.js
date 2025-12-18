import { getAllTires, createTire, updateTire, deleteTire } from '../controllers/tireController.js';
import Tire from '../models/tire.js';

jest.mock('../models/tire.js');

describe('Tire Controller Tests', () => {
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
    });

    describe('getAllTires', () => {
        it('should return all tires with populated truck data', async () => {
            const mockTires = [
                { _id: '1', brand: 'Michelin', model: 'XZE', truck: { immatriculation: 'ABC123' } },
                { _id: '2', brand: 'Bridgestone', model: 'R249', truck: { immatriculation: 'XYZ789' } }
            ];

            Tire.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockTires)
            });

            await getAllTires(req, res);

            expect(Tire.find).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockTires);
        });

        it('should handle errors', async () => {
            Tire.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockRejectedValue(new Error('Database error'))
            });

            await getAllTires(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
        });
    });

    describe('createTire', () => {
        it('should create a new tire successfully', async () => {
            const tireData = {
                brand: 'Michelin',
                model: 'XZE',
                size: '295/80R22.5',
                truck: 'truck123',
                position: 'front-left',
                condition: 'good'
            };

            req.body = tireData;

            const mockTire = { _id: 'tire123', ...tireData, save: jest.fn() };
            Tire.mockImplementation(() => mockTire);

            await createTire(req, res);

            expect(mockTire.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockTire);
        });

        it('should return 400 on validation error', async () => {
            req.body = { brand: 'Michelin' }; // Missing required fields

            const mockTire = {
                save: jest.fn().mockRejectedValue(new Error('Validation failed'))
            };
            Tire.mockImplementation(() => mockTire);

            await createTire(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updateTire', () => {
        it('should update tire successfully', async () => {
            req.params.id = 'tire123';
            req.body = { condition: 'fair', currentKm: 50000 };

            const updatedTire = { _id: 'tire123', condition: 'fair', currentKm: 50000 };
            Tire.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedTire);

            await updateTire(req, res);

            expect(Tire.findByIdAndUpdate).toHaveBeenCalledWith(
                'tire123',
                req.body,
                { new: true }
            );
            expect(res.json).toHaveBeenCalledWith(updatedTire);
        });

        it('should return 404 if tire not found', async () => {
            req.params.id = 'invalid';
            Tire.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

            await updateTire(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Tire not found' });
        });
    });

    describe('deleteTire', () => {
        it('should delete tire successfully', async () => {
            req.params.id = 'tire123';
            const deletedTire = { _id: 'tire123', brand: 'Michelin' };
            Tire.findByIdAndDelete = jest.fn().mockResolvedValue(deletedTire);

            await deleteTire(req, res);

            expect(Tire.findByIdAndDelete).toHaveBeenCalledWith('tire123');
            expect(res.json).toHaveBeenCalledWith({ message: 'Tire deleted successfully' });
        });

        it('should return 404 if tire not found', async () => {
            req.params.id = 'invalid';
            Tire.findByIdAndDelete = jest.fn().mockResolvedValue(null);

            await deleteTire(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
