import mongoose from 'mongose';


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
    status:{
        type : String,
        enum : ['active','inactive'],
        default : 'active'
    },
    roleId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Role',
        required : true
    }
},{
    timestamps : true
});

export default mongoose.model('user',UserSchema);

