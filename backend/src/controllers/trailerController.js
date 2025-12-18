import Trailer from '../models/trailer.js';

export const getAllTrailers = async (req, res) => {
    try {
        const trailers = await Trailer.find();
        res.json(trailers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTrailer = async (req, res) => {
    try {
        const trailer = new Trailer(req.body);
        await trailer.save();
        res.status(201).json(trailer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTrailer = async (req, res) => {
    try {
        const trailer = await Trailer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!trailer) {
            return res.status(404).json({ message: 'Trailer not found' });
        }
        res.json(trailer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTrailer = async (req, res) => {
    try {
        const trailer = await Trailer.findByIdAndDelete(req.params.id);
        if (!trailer) {
            return res.status(404).json({ message: 'Trailer not found' });
        }
        res.json({ message: 'Trailer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};