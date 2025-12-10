import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({

    fullname:{
        type : String,
        required : true,
        trim : true
    },
    email:{
        type : String,
        required : true,
        unique : true
    },
    password:{
        type : String,
        required : true
    },
    age:{
        type : Number,
        required : true
    },
    phoneNumber:{
        type : String,
        required : true
    },
    status:{
        type : String,
        enum : ['active','inactive'],
        default : 'active'
    },
    role : {
        type : String,
        enum : ['admin' , 'cheffeur'],
        default : 'cheffeur'
    }
    
},{
    timestamps : true
});

export default mongoose.model('user',UserSchema);

