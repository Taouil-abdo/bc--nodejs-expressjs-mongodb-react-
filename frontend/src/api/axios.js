import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5010/api/V1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Update trip status
export const updateTripStatus = async (tripId, status) => {
  const response = await axios.patch(`/driver/${tripId}/status`, { status });
  return response.data;
};

// Update trip data (km, fuel, notes)
export const updateTripData = async (tripId, data) => {
  const response = await axios.patch(`/driver/${tripId}/data`, data);
  return response.data;
};

// Download trip PDF
export const downloadTripPDF = async (tripId) => {
  const response = await axios.get(`/driver/${tripId}/pdf`, {
    responseType: 'blob', // Ensure the response is treated as a file
  });

  // Create a URL for the file and trigger download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `trip_${tripId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

export default api;