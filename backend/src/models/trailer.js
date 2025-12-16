import mongoose from 'mongoose';

// Simple trailer model
const TrailerSchema = new mongoose.Schema({
    immatriculation: {
        type: String,
        required: true,
        unique: true
    },
    marque: {
        type: String,
        required: true
    },
    modele: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'in_use', 'maintenance'],
        default: 'available'
    },
    dateAcquisition: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Trailer', TrailerSchema);