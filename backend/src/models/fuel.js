import mongoose from 'mongoose';

// Simple fuel tracking model
const FuelSchema = new mongoose.Schema({
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
        required: true
    },
    liters: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model('Fuel', FuelSchema);