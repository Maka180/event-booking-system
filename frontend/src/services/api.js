import axios from 'axios';

// This baseURL ensures everything goes to your Node.js server on Port 5000
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token'); 
  
  // Helpful log to verify the handshake in the console
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
 * ✨ THE GEMINI AI SERVICE
 * Sends the event title to the backend to generate a professional description.
 */
export const generateAIDescription = (title) => API.post('/events/ai/describe', { title });