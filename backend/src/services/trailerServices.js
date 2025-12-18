import Trailer from '../models/trailer.js';

export const getAllTrailers = async (trailerData) => {
    try {
        const trailers = await Trailer.find();
        res.json(trailers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTrailer = async (trailerData) => {
    try {
        const trailer = new Trailer(trailerData);
        await trailer.save();
        res.status(201).json(trailer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTrailer = async (trailerId, data) => {
    try {
        const trailer = await Trailer.findByIdAndUpdate(trailerId, data, { new: true });
        if (!trailer) {
            return res.status(404).json({ message: 'Trailer not found' });
        }
        res.json(trailer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const removeTrailer = async (trailerId) => {
    try {
        const trailer = await Trailer.findByIdAndDelete(trailerId);
        if (!trailer) {
            return res.status(404).json({ message: 'Trailer not found' });
        }
        res.json({ message: 'Trailer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};