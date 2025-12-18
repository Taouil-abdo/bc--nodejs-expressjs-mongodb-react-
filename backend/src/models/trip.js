import mongoose from 'mongoose'

const tripSchema = new mongoose.Schema({
    truck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Truck',
      required: true
    },
    trailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trailer'
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    startKm: Number,
    endKm: Number,
    currentKm: Number,
    fuelUsed: Number,
    fuelCost: Number,
    notes: String,
    
  }, { timestamps: true });
  
  tripSchema.virtual('distance').get(function() {
    if (this.endKm && this.startKm) {
      return this.endKm - this.startKm;
    }
    return 0;
  });
  
  export default mongoose.model('Trip', tripSchema);
      