import mongoose from "mongoose"

const tireSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  size: { type: String, required: true },
  truck: { type: mongoose.Schema.Types.ObjectId, ref: "Truck", required: true },
  condition: { type: String, enum: ["excellent", "good", "fair", "poor"], default: "good" },
  status: {
    type: String,
    enum: ['assigned', 'available', 'in-maintenance'],
    default: 'assigned'
  },
  installationDate: { type: Date, default: Date.now },
  lastReplacementDate: Date,
  currentKm: { type: Number, default: 0 },
  position: {
    type: String,
    enum: ['front-left', 'front-right', 'rear-left', 'rear-right'],
    required: true
  },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Tire", tireSchema)
