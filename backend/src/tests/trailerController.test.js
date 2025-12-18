import { getAllTrailers, createTrailer, updateTrailer, deleteTrailer } from '../controllers/trailerController.js';
import Trailer from '../models/trailer.js';

jest.mock('../models/trailer.js');

describe('Trailer Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('getAllTrailers', () => {
        it('should return all trailers', async () => {
            const mockTrailers = [
                { _id: '1', immatriculation: 'TR001', marque: 'Schmitz', status: 'available' },
                { _id: '2', immatriculation: 'TR002', marque: 'Krone', status: 'in_use' }
            ];

            Trailer.find = jest.fn().mockResolvedValue(mockTrailers);

            await getAllTrailers(req, res);

            expect(Trailer.find).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockTrailers);
        });
    });

    describe('createTrailer', () => {
        it('should create a new trailer', async () => {
            const trailerData = {
                immatriculation: 'TR003',
                marque: 'Schmitz',
                modele: 'S.KO',
                dateAcquisition: new Date()
            };

            req.body = trailerData;
            const mockTrailer = { _id: 'trailer123', ...trailerData, save: jest.fn() };
            Trailer.mockImplementation(() => mockTrailer);

            await createTrailer(req, res);

            expect(mockTrailer.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should handle duplicate immatriculation error', async () => {
            req.body = { immatriculation: 'TR001' };
            const mockTrailer = {
                save: jest.fn().mockRejectedValue({ code: 11000 })
            };
            Trailer.mockImplementation(() => mockTrailer);

            await createTrailer(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updateTrailer', () => {
        it('should update trailer status', async () => {
            req.params.id = 'trailer123';
            req.body = { status: 'maintenance' };

            const updatedTrailer = { _id: 'trailer123', status: 'maintenance' };
            Trailer.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedTrailer);

            await updateTrailer(req, res);

            expect(Trailer.findByIdAndUpdate).toHaveBeenCalledWith(
                'trailer123',
                req.body,
                { new: true }
            );
            expect(res.json).toHaveBeenCalledWith(updatedTrailer);
        });
    });

    describe('deleteTrailer', () => {
        it('should delete trailer successfully', async () => {
            req.params.id = 'trailer123';
            Trailer.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: 'trailer123' });

            await deleteTrailer(req, res);

            expect(res.json).toHaveBeenCalledWith({ message: 'Trailer deleted successfully' });
        });
    });
});
