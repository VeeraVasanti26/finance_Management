import dashboardService from '../services/dashboard.service.js';
import apiResponse from '../utils/apiResponse.js';

const getSummary = async (req, res) => {
  try {
    const summary = await dashboardService.getSummary();
    apiResponse.success(res, summary);
  } catch (err) {
    apiResponse.error(res, err.message);
  }
};

export default { getSummary };
