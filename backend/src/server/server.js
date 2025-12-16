import express from 'express';
import AuthRoute from '../routes/authRoutes.js';
import AdminRoute from '../routes/adminRoutes.js';
import DriverRoute from '../routes/DriverRoutes.js';
import TruckRoute from '../routes/truckRoutes.js';
import TrailerRoute from '../routes/trailerRoutes.js';
import TripRoute from '../routes/tripRoutes.js';
import TireRoute from '../routes/tireRoutes.js';
import MaintenanceRoute from '../routes/maintenanceRoutes.js';
import ReportsRoute from '../routes/reportsRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import connect from '../config/db.js'

dotenv.config();
const app = express();


connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true
}))


app.use('/api/V1/auth', AuthRoute);
app.use('/api/V1/admin', AdminRoute);
app.use('/api/V1/driver', DriverRoute);
app.use('/api/V1/trucks', TruckRoute);
app.use('/api/V1/trailers', TrailerRoute);
app.use('/api/V1/trips', TripRoute);
app.use('/api/V1/tires', TireRoute);
app.use('/api/V1/maintenance', MaintenanceRoute);
app.use('/api/V1/reports', ReportsRoute);



try {
    app.listen(5010, () => {
        console.log('Server is running on port ' + process.env.PORT);
    });
} catch (error) {
    console.error('Server error:', error);
}
export default app;