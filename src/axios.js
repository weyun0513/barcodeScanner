import axios from 'axios';
// config


// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: "https://us-central1-announce-a6f78.cloudfunctions.net/api/" });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
