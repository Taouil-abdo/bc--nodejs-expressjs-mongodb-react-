import express from 'express';

import {login , register, logout} from '../controllers/authController.js';
import { validateLogin , validateUser ,validate } from '../middlewares/validation.js';


const Router = express.Router();

Router.post('/register' , validate(validateUser) , register);
Router.post('/login' , validate(validateLogin) , login);
Router.post('/logout' , logout);

export default Router;



