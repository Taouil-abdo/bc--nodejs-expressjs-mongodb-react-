import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const db = async () => {
    try{
        const uri = process.env.MONGODB_URI;
        const res = await mongoose.connect(uri);
        if(res){
            console.log('Database connected successfully');
        }
        else{
            console.log('Database connection failed');
        }
    }catch(error){
        console.error('Database connection error:', error);
    }
}
export default db;