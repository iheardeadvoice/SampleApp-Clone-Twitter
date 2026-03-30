import axios from 'axios';

const API_URL = 'http://localhost:5026/api';

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/Users`);
  return response.data;
};