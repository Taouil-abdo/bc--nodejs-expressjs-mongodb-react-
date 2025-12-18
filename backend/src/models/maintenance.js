import mongoose from "mongoose"

const maintenanceSchema = new mongoose.Schema({

  targetModel : {
    type : String,
    enum : ['Truck' , 'Trailer' ],
    required : true
  },
  targetId: { type: mongoose.Schema.Types.ObjectId, refPath: "TruckOrTrailer", required: true },
  maintenanceType: { type: String, enum: ["oil-change", "tire-replacement", "inspection", "other"], required: true },
  scheduledDate: { type: Date, required: true },
  completedDate: Date,
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  cost: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Maintenance", maintenanceSchema)