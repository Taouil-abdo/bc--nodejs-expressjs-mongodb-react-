import Truck from '../models/truck.js';
import * as truckService from '../services/truckService.js';

export const getAllTrucks = async (req, res) => {
    try {
        const trucks = await Truck.find();
        res.json(trucks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTruck = async (req, res) => {
    try {

        const truck = await truckService.create(req.body);
        if(!truck){

            return res.status(400).json({message:'faild to add new truck'});
        }
        res.status(201).json({
            message:'truck created with success',
            ...truck
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTruck = async (req, res) => {
    try {
        const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!truck) {
            return res.status(404).json({ message: 'Truck not found' });
        }
        res.json(truck);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTruck = async (req, res) => {
    try {
        const truck = await truckService.deleteTruck(req.params.id);
        if (!truck) {
            return res.status(404).json({ message: 'Truck not found' });
        }
        res.json({ message: 'Truck deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};