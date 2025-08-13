import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create a custom Axios instance
const api = axios.create({
  baseURL: API_BASE_URL, // Your API base URL
  headers: {
    "Content-Type": "application/json",
    // You can add other headers like Authorization here
  },
});

/**
 * Handles GET requests
 * @param {string} endpoint - The API endpoint to call (e.g., '/users')
 * @param {object} [params] - Optional query parameters
 * @returns {Promise<any>} The response data or null on error
 */
export const getRequest = async (endpoint, params = {}) => {
  try {
    console.log(params);
    const response = await api.get(endpoint, { params });
    return response.data?.data || response.data;
  } catch (error) {
    console.error(`GET request to ${endpoint} failed:`, error);
    return error;
  }
};

/**
 * Handles POST requests
 * @param {string} endpoint - The API endpoint to call (e.g., '/users')
 * @param {object} data - The data to send in the request body
 * @returns {Promise<any>} The response data or null on error
 */
export const postRequest = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`POST request to ${endpoint} failed:`, error);
    // You can add more robust error handling here
    return error;
  }
};