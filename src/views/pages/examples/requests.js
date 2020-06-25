import axios from 'axios';

const API_ROOT = process.env.SERVER_URI;

axios.defaults.baseURL = 'http://165.22.212.180:8002';

export const fetchUsers = () => {
  return axios.get(`/users`).then((res) => res.data.data);
};
