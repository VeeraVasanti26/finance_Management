const success = (res, data, message = 'Success', statusCode = 200, pagination = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
  });
};

const error = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default { success, error };
