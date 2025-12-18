import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const migrateTires = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/your-database');
        const db = mongoose.connection.db;
        const tiresCollection = db.collection('tires');
        
        // Update all existing tire documents
        const result = await tiresCollection.updateMany(
            {},
            {
                $set: {
                    brand: "Unknown",
                    model: "Unknown", 
                    currentKm: 0
                }
            }
        );
        
        // Fix condition values
        await tiresCollection.updateMany(
            { condition: "new" },
            { $set: { condition: "excellent" } }
        );
        
        await tiresCollection.updateMany(
            { condition: "worn" },
            { $set: { condition: "fair" } }
        );
        
        await tiresCollection.updateMany(
            { condition: "needs-replacement" },
            { $set: { condition: "poor" } }
        );
        
        // Fix position values
        await tiresCollection.updateMany(
            { position: "left" },
            { $set: { position: "front-left" } }
        );
        
        await tiresCollection.updateMany(
            { position: "right" },
            { $set: { position: "front-right" } }
        );
        
        console.log(`Migration completed. Updated ${result.modifiedCount} documents.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateTires();