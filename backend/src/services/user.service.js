import User from '../models/user.model.js';

const getAllUsers = async (query = {}) => {
  const { page = 1, limit = 10, search, role, status } = query;
  
  const filter = { isDeleted: { $ne: true } };

  if (search && search.trim()) {
    const searchTrimmed = search.trim();
    const escapedSearch = searchTrimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { name: { $regex: escapedSearch, $options: 'i' } },
      { email: { $regex: escapedSearch, $options: 'i' } }
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (status) {
    filter.status = status;
  }

  console.log('User Filter:', JSON.stringify(filter, null, 2));

  const skip = (page - 1) * limit;
  const users = await User.find(filter)
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await User.countDocuments(filter);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

const getUserById = async (id) => {
  return await User.findOne({ _id: id, isDeleted: { $ne: true } });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const updateUser = async (id, userData, currentUser) => {
  // Only admin can change roles
  if (userData.role && currentUser.role !== 'admin') {
    delete userData.role;
  }
  
  return await User.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, userData, {
    new: true,
    runValidators: true,
  });
};

const deleteUser = async (id) => {
  return await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export default { getAllUsers, getUserById, createUser, updateUser, deleteUser };
