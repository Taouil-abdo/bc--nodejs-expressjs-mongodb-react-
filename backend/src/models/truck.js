import mongoose from 'mongoose' 

const TruckSchema = new mongoose.Schema({
immatriculation:{
    type : String,
    unique : true,
    required:true
},
marque : {
    type : String,
    required : true,
},
modele: {
    type : String, 
    required: true
},
kilometrageActuel : {
    type : Number,
    required : true,
},
kilometrageInitial : {
    type : Number,
    required : true
},
status: {
    type: String,
    enum: ['available', 'in_use', 'maintenance'],
    default: 'available'
  },
dateAcquisition : {
    type : Date,
    required : true
},
derniereVidange:{
    type : Date,
    required : true
},
lastOilChangeKm: {
    type: Number,
    default: 0
},
derniereRevision : {
    type : Date,
    required : true
},
tires: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tire'
  }],

},{
    timestamps : true
});

export default mongoose.model('Truck',TruckSchema);
