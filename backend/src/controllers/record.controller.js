import recordService from '../services/record.service.js';
import apiResponse from '../utils/apiResponse.js';

const getAllRecords = async (req, res) => {
  try {
        const result = await recordService.getAllRecords(req.query);
    apiResponse.success(res, result.records, 'Records fetched successfully', 200, result.pagination);
  } catch (err) {
    apiResponse.error(res, err.message);
  }
};

const getRecordById = async (req, res) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    if (!record) return apiResponse.error(res, 'Record not found', 404);
    apiResponse.success(res, record);
  } catch (err) {
    apiResponse.error(res, err.message);
  }
};

const createRecord = async (req, res) => {
  try {
    const recordData = { ...req.body, user: req.user._id };
    const record = await recordService.createRecord(recordData);
    apiResponse.success(res, record, 'Record created successfully', 201);
  } catch (err) {
    apiResponse.error(res, err.message, 400);
  }
};

const updateRecord = async (req, res) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body);
    if (!record) return apiResponse.error(res, 'Record not found', 404);
    apiResponse.success(res, record, 'Record updated successfully');
  } catch (err) {
    apiResponse.error(res, err.message, 400);
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await recordService.deleteRecord(req.params.id);
    if (!record) return apiResponse.error(res, 'Record not found', 404);
    apiResponse.success(res, null, 'Record deleted successfully');
  } catch (err) {
    apiResponse.error(res, err.message);
  }
};

export default { getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord };
