// Crée et gère les camions, remorques, pneus.
// Crée les trajets et les assigne aux chauffeurs.
// Consulte les rapports : consommation, kilométrage, maintenance.
// Configure les règles de maintenance (périodicité pneus, vidange, révision, etc.).

import adminService from '../models/adminService.js';
import authService from '../services/authService.js';

export const createDriver = async (res , req) => {

    try {
            const { fullname, email, password, age, phoneNumber, status, role } = req.body;
            const result = await authService.register({ fullname, email, password, age, phoneNumber, status, role });
            
            return res.status(201).json({
                message: 'User registered successfully',
                ...result
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message || 'Registration failed'
            });
        }

}

export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const updatedUser = await adminService.toggleUserStatus({ _id: id });

        return res.status(200).json({
            message: "User status updated successfully",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUsers = async (req ,res) => {

    try{
        const result = await adminService.allUsers();
        return res.status(201).json({
            ...result
        });
    }catch(error){
        return res.status(400).json({
            message : message.error,
        });
    }
}

export const getUserById = async (req , res) => {
    try{

        const {id} = req.params;
        const result = await adminService.getDriverById({_id:id});
        return res.status(201).json({
            ...result
        });

    }catch(error){
        return res.status(400).json({ message: error.message });
    }
} 

//truck

 const addTruck = (res ,req) => {
    try{




    }catch(error){
        return res.status(400).json({ message: error.message });

    }
}
// tyre

 const addTyre  = (res ,req) => {
    try{

    }catch(error){
        return res.status(400).json({ message: error.message });
    }

}

// trip
 const addTrip = (res , req) => {
    try{

    }catch(error){
        return res.status(400).json({ message: error.message });
    }

}

