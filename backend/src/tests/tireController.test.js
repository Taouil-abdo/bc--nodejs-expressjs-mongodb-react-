import { getAllTires, createTire, updateTire, deleteTire } from '../controllers/tireController.js';
import Tire from '../models/tire.js';

// Mock the Tire model
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
        jest.clearAllMocks();
    });

    describe('getAllTires', () => {
        it('should return all tires with populated truck data', async () => {
            const mockTires = [{ _id: '1', brand: 'Michelin' }];
            const mockPopulate = jest.fn().mockResolvedValue(mockTires);
            Tire.find.mockReturnValue({ populate: mockPopulate });

            await getAllTires(req, res);

            expect(Tire.find).toHaveBeenCalled();
            expect(mockPopulate).toHaveBeenCalledWith('truck', 'immatriculation marque modele');
            expect(res.json).toHaveBeenCalledWith(mockTires);
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            Tire.find.mockReturnValue({ populate: jest.fn().mockRejectedValue(error) });

            await getAllTires(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
        });
    });

    describe('createTire', () => {
        it('should create a new tire successfully', async () => {
            const tireData = { brand: 'Michelin' };
            req.body = tireData;

            const mockSave = jest.fn();
            Tire.mockImplementation(() => ({
                save: mockSave
            }));

            await createTire(req, res);

            expect(Tire).toHaveBeenCalledWith(tireData);
            expect(mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('updateTire', () => {
        it('should update tire successfully', async () => {
            req.params.id = '123';
            req.body = { brand: 'Updated' };
            const updatedTire = { _id: '123', brand: 'Updated' };

            Tire.findByIdAndUpdate.mockResolvedValue(updatedTire);

            await updateTire(req, res);

            expect(Tire.findByIdAndUpdate).toHaveBeenCalledWith('123', req.body, { new: true });
            expect(res.json).toHaveBeenCalledWith(updatedTire);
        });

        it('should return 404 if tire not found', async () => {
            req.params.id = '123';
            Tire.findByIdAndUpdate.mockResolvedValue(null);

            await updateTire(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteTire', () => {
        it('should delete tire successfully', async () => {
            req.params.id = '123';
            Tire.findByIdAndDelete.mockResolvedValue({ _id: '123' });

            await deleteTire(req, res);

            expect(Tire.findByIdAndDelete).toHaveBeenCalledWith('123');
            expect(res.json).toHaveBeenCalledWith({ message: 'Tire deleted successfully' });
        });
    });
});
