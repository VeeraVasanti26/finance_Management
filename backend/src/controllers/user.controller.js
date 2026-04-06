import userService from '../services/user.service.js';
import apiResponse from '../utils/apiResponse.js';

const getAllUsers = async (req, res) => {
  try {
    console.log('GET /users query:', req.query);
    const result = await userService.getAllUsers(req.query);
    apiResponse.success(res, result.users, 'Users fetched successfully', 200, result.pagination);
  } catch (err) {
    apiResponse.error(res, err.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return apiResponse.error(res, 'User not found', 404);
    apiResponse.success(res, user);
  } catch (err) {
    apiResponse.error(res, err.message);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    apiResponse.success(res, user, 'User created successfully', 201);
  } catch (err) {
    apiResponse.error(res, err.message, 400);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user);
    if (!user) return apiResponse.error(res, 'User not found', 404);
    apiResponse.success(res, user, 'User updated successfully');
  } catch (err) {
    apiResponse.error(res, err.message, 400);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return apiResponse.error(res, 'User not found', 404);
    apiResponse.success(res, null, 'User deleted successfully');
  } catch (err) {
    apiResponse.error(res, err.message);
  }
};

export default { getAllUsers, getUserById, createUser, updateUser, deleteUser };
