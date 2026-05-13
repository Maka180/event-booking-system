import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchEvents, bookEvent, unjoinEvent, deleteEvent } from './services/api';
import CreateEvent from './components/CreateEvent';

function App() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [authMode, setAuthMode] = useState('login'); 

  // Form States
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', role: 'attendee' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // ✅ useEffect BEFORE any conditional returns
  useEffect(() => {
    if (isLoggedIn) loadEvents();
  }, [isLoggedIn]);

  const loadEvents = async () => {
    try {
      const { data } = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // --- AUTH HANDLERS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, loginData);
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid email or password.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, signupData);
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email: forgotEmail });
      setMessage({ text: data.message, type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Error sending email", type: 'error' });
    }
  };

  // --- EVENT HANDLERS ---
  const handleBook = async (id) => {
    try {
      await bookEvent(id);
      loadEvents();
    } catch (err) {
      if (err.response?.status === 400) {
        alert("You have already secured a ticket for this event!");
      } else {
        alert("Session error. Please log out and back in.");
      }
    }
  };

  const handleUnjoin = async (id) => {
    try {
      await unjoinEvent(id);
      loadEvents();
    } catch (err) {
      alert("Could not unjoin. Try again later.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await deleteEvent(id);
        loadEvents();
      } catch (err) {
        alert("Action denied. You can only delete events you created.");
      }
    }
  };

  const filteredEvents = events.filter(e => {
    const term = searchTerm.toLowerCase();
    const eventDate = new Date(e.date).toLocaleDateString().toLowerCase();
    return (
      e.title?.toLowerCase().includes(term) || 
      e.location?.toLowerCase().includes(term) ||
      eventDate.includes(term)
    );
  });

  // --- AUTH SCREEN UI ---
  if (!isLoggedIn) {
    return (
      <div className="login-screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f9f9f7' }}>
        <div className="login-card" style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px' }}>
          {authMode === 'login' && (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>EventHub Login</h2>
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label className="field-label">EMAIL ADDRESS</label>
                <input type="email" className="field-input" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
                <label className="field-label">PASSWORD</label>
                <input type="password" className="field-input" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required />
                <button type="submit" className="search-btn">LOGIN</button>
              </form>
              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                <p>New here? <span style={{ color: '#ff4d4d', cursor: 'pointer' }} onClick={() => setAuthMode('signup')}>Sign Up</span></p>
                <p style={{ color: '#888', cursor: 'pointer', marginTop: '5px' }} onClick={() => setAuthMode('forgot')}>Forgot Password?</p>
              </div>
            </>
          )}
          {authMode === 'signup' && (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label className="field-label">FULL NAME</label>
                <input type="text" className="field-input" value={signupData.name} onChange={(e) => setSignupData({...signupData, name: e.target.value})} required />
                <label className="field-label">EMAIL ADDRESS</label>
                <input type="email" className="field-input" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} required />
                <label className="field-label">PASSWORD</label>
                <input type="password" className="field-input" value={signupData.password} onChange={(e) => setSignupData({...signupData, password: e.target.value})} required />
                <button type="submit" className="search-btn">CREATE ACCOUNT</button>
              </form>
              <p style={{ textAlign: 'center', marginTop: '1rem' }}>Already have an account? <span style={{ color: '#ff4d4d', cursor: 'pointer' }} onClick={() => setAuthMode('login')}>Login</span></p>
            </>
          )}
          {authMode === 'forgot' && (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Reset Password</h2>
              <p style={{ textAlign: 'center', color: '#666', marginBottom: '1rem' }}>Enter your email to receive a reset link.</p>
              <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label className="field-label">EMAIL ADDRESS</label>
                <input type="email" className="field-input" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
                <button type="submit" className="search-btn">SEND LINK</button>
              </form>
              {message.text && <p style={{ textAlign: 'center', marginTop: '1rem', color: message.type === 'error' ? 'red' : 'green' }}>{message.text}</p>}
              <p style={{ textAlign: 'center', marginTop: '1rem', color: '#ff4d4d', cursor: 'pointer' }} onClick={() => setAuthMode('login')}>Back to Login</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- MAIN APP UI ---
  return (
    <div className="app-wrapper">
      <nav className="header">
        <div className="logo">Event<span>Hub</span></div>
        <button className="logout-btn" onClick={() => { localStorage.clear(); setIsLoggedIn(false); setAuthMode('login'); }}>Log out</button>
      </nav>

      <header className="hero">
        <div className="max-container">
          <h1>Explore<br/>Events Near You</h1>
        </div>
      </header>

      <main className="max-container">
        <div className="search-wrap">
          <div className="search-inner">
            <input className="search-input" placeholder="Search by name, location, or date..." onChange={(e) => setSearchTerm(e.target.value)} />
            <button className="search-btn">Search</button>
          </div>
        </div>

        <div className="stats-bar">
          <div className="stat-item"><div className="stat-num">{events.length}</div><div className="stat-lbl">Events Available</div></div>
          <div className="stat-divider"></div>
          <div className="stat-item"><div className="stat-num">{events.reduce((sum, e) => sum + (e.attendees?.length || 0), 0)}</div><div className="stat-lbl">Joined</div></div>
          <div className="stat-divider"></div>
          <div className="stat-item"><div className="stat-num">May</div><div className="stat-lbl">2026</div></div>
        </div>

        <div className="cards-grid">
          {filteredEvents.map(event => (
            <div className="event-card" key={event._id}>
              <div 
                className="card-thumb" 
                style={{ 
                  backgroundImage: `url(${event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500'})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center', 
                  position: 'relative' 
                }}
              >
                <span className="card-badge">{event.attendees?.length || 0} JOINED</span>
                
                {event.category && (
                  <span style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#333',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    letterSpacing: '0.5px'
                  }}>
                    ✨ {event.category.toUpperCase()}
                  </span>
                )}

                <button className="delete-icon-btn" onClick={() => handleDelete(event._id)}>🗑️</button>
              </div>
              <div className="card-body">
                <div className="card-content">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
                <div className="card-footer">
                  <div className="card-meta" style={{ marginBottom: '1rem', color: '#888', fontSize: '0.85rem' }}>
                    <div><span>📅 {new Date(event.date).toDateString()}</span></div>
                    <div><span>📍 {event.location}</span></div>
                  </div>
                  <div className="card-actions" style={{ display: 'flex', gap: '10px' }}>
                    <button className="card-btn" onClick={() => handleBook(event._id)}>JOIN</button>
                    <button className="card-btn-outline" onClick={() => handleUnjoin(event._id)}>UNJOIN</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-section">
          <h2 className="section-title">Host an Event</h2>
          <CreateEvent onEventCreated={loadEvents} />
        </div>
      </main>
    </div>
  );
}

export default App;