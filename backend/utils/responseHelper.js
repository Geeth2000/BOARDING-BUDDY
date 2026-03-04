/**
 * Standard API Response Formatter
 */

/**
 * Success Response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {object} data - Response data
 */
const successResponse = (
  res,
  statusCode = 200,
  message = "Success",
  data = null,
) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Paginated Response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {object} data - Response data
 * @param {object} pagination - Pagination info
 */
const paginatedResponse = (
  res,
  statusCode = 200,
  message = "Success",
  data = [],
  pagination = {},
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    count: data.length,
    pagination,
    data,
  });
};

module.exports = {
  successResponse,
  paginatedResponse,
};
