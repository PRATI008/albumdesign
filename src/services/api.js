import axios from 'axios';

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
).replace(/\/$/, '');

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Site Settings API
export const getSiteSettings = async () => {
  try {
    const res = await apiClient.get('/site-settings');
    if (res.data?.success && res.data.settings) {
      return res.data.settings;
    }
    return null;
  } catch (err) {
    console.warn('Site settings fetch error, using defaults:', err.message);
    return null;
  }
};

// Packages API
export const getPackages = async () => {
  try {
    const res = await apiClient.get('/packages');
    if (res.data?.success && Array.isArray(res.data.packages)) {
      return res.data.packages;
    }
    return [];
  } catch (err) {
    console.warn('Packages fetch error:', err.message);
    return [];
  }
};

// Designs API
export const getDesigns = async () => {
  try {
    const res = await apiClient.get('/designs');
    const list = Array.isArray(res.data)
      ? res.data
      : res.data?.designs || res.data?.data || [];
    return list;
  } catch (err) {
    console.warn('Designs fetch error:', err.message);
    return [];
  }
};

// Enquiry API
export const submitEnquiry = async (enquiryData) => {
  const res = await apiClient.post('/enquiry', enquiryData);
  return res.data;
};

// Booking API
export const submitBooking = async (bookingData) => {
  const res = await apiClient.post('/booking', bookingData);
  return res.data;
};

// Auth API
export const registerUser = async (userData) => {
  const res = await apiClient.post('/register', userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await apiClient.post('/login', credentials);
  if (res.data?.success && res.data?.token) {
    localStorage.setItem('token', res.data.token);
    if (res.data.user) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
  }
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('authChange'));
};

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

