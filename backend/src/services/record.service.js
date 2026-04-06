import Record from '../models/record.model.js';

const getAllRecords = async (query = {}) => {
  const { type, category, startDate, endDate, search, page = 1, limit = 10 } = query;
  const filter = {
    isDeleted: { $ne: true }
  };
  
  if (type) filter.type = type;
  if (category) filter.category = category;
  
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (search && search.trim()) {
    const searchTrimmed = search.trim();
    filter.$or = [
      { category: { $regex: searchTrimmed, $options: 'i' } },
      { notes: { $regex: searchTrimmed, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;
  
  const records = await Record.find(filter)
    .sort('-date')
    .skip(skip)
    .limit(Number(limit));
    
  const total = await Record.countDocuments(filter);

  return {
    records,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

const getRecordById = async (id) => {
  return await Record.findOne({ _id: id, isDeleted: { $ne: true } });
};

const createRecord = async (recordData) => {
  return await Record.create(recordData);
};

const updateRecord = async (id, recordData) => {
  return await Record.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, recordData, {
    new: true,
    runValidators: true,
  });
};

const deleteRecord = async (id) => {
  return await Record.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export default { getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord };
