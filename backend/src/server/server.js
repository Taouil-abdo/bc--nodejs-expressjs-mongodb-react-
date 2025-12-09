import express from 'express';

const app = express();


try{
    app.listen(process.env.PORT, () => {
        console.log('Server is running on port 3000');
    });
}catch(error){
    console.error('Server error:', error);
}
export default app;