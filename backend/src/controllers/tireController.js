import Tire from '../models/tire.js';

// Simple tire controller - easy to understand
export const getAllTires = async (req, res) => {
    try {
        const tires = await Tire.find().populate('truck', 'immatriculation marque modele');
        res.json(tires);
    } catch (error) {
        console.error('Error fetching tires:', error);
        res.status(500).json({ message: error.message });
    }
};

export const createTire = async (req, res) => {
    try {
        const tire = new Tire(req.body);
        await tire.save();
        res.status(201).json(tire);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTire = async (req, res) => {
    try {
        const tire = await Tire.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tire) {
            return res.status(404).json({ message: 'Tire not found' });
        }
        res.json(tire);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTire = async (req, res) => {
    try {
        const tire = await Tire.findByIdAndDelete(req.params.id);
        if (!tire) {
            return res.status(404).json({ message: 'Tire not found' });
        }
        res.json({ message: 'Tire deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check which tires need replacement
export const getTiresNeedingReplacement = async (req, res) => {
    try {
        const tires = await Tire.find({
            $or: [
                { currentKm: { $gte: 80000 } }, // More than 80,000 km
                { condition: 'poor' }
            ]
        }).populate('truck', 'immatriculation');
        res.json(tires);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};