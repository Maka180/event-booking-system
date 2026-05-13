import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://localhost:5000/api';

const API = axios.create({ 
  baseURL: API_BASE_URL 
});

// REQUEST INTERCEPTOR
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token'); 
  
  console.log("Checking for token...", token ? "Token Found ✅" : "No Token Found ❌");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- Existing Event Routes ---
export const fetchEvents = () => API.get('/events');
export const createEvent = (newEvent) => API.post('/events', newEvent);
export const unjoinEvent = (id) => API.put(`/events/${id}/unjoin`);
export const deleteEvent = (id) => API.delete(`/events/${id}`);
export const bookEvent = (id) => API.put(`/events/${id}/book`);

/**
 * ✨ AI SERVICE
 * Sends the event title to the backend to generate a professional description.
 */
export const generateAIDescription = (title) => API.post('/events/ai/describe', { title });

export default API;