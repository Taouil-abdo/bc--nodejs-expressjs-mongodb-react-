import User from '../models/user.js';



const toggleUserStatus = async (data) => {
    const user = checkUser(data);

    const newStatus = user.status === "active" ? "inactive" : "active";

    const updatedUser = await User.findByIdAndUpdate(
        data._id,
        { status: newStatus },
        { new: true } 
    );

    return updatedUser;
};

const allUsers = async (res, next) => {
    try {
    const users = await User.find().select('-password');
    res.json({ users });
    } catch (err) { next(err); }
};

const getDriverById = async (data) => {
    const user = checkUser(data);
    return {
        ...user,
    }
}

const checkUser = async (data) => {

    const result = await User.findOne(data._id);
    if(!result){
        throw new Error('user not found');
    }
    return {
        ...result
    }
}

export {
    toggleUserStatus,
    allUsers,
    getDriverById
}