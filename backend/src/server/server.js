import express from 'express';
import authRouter from '../routes/authRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';
import connect from '../config/db.js'

dotenv.config();


const app = express();


connect();



app.use(express.json());
app.use(express.urlencoded({extende : true}));

// app.use(cors({
//     origin : ['http://localhost:'+process.env.PORT],
//     credential : true
// }))

app.use('/api/V1/auth',authRouter);



try{
    app.listen(5010, () => {
        console.log('Server is running on port '+process.env.PORT);
    });
}catch(error){
    console.error('Server error:', error);
}
export default app;