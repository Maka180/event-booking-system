import React, { useState } from 'react';
import { createEvent, generateAIDescription } from '../services/api';

function CreateEvent({ onEventCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    imageUrl: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAIDescription = async () => {
    if (!formData.title) {
      return alert("Please enter an EVENT TITLE first so the AI knows what to write about!");
    }

    setIsGenerating(true);
    try {
      const response = await generateAIDescription(formData.title);
      setFormData(prev => ({ ...prev, description: response.data.description }));
    } catch (err) {
      console.error("AI Generation failed:", err);
      const status = err.response?.status;
      if (status === 401) {
        alert("Session expired. Please log in again.");
      } else {
        alert(`AI service error (${status || 'Offline'}). Check if backend is running.`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      onEventCreated(); 
      setFormData({ title: '', description: '', date: '', location: '', imageUrl: '' });
      alert("Event Published!");
    } catch (err) {
      console.error(err);
      alert("Failed to create event. Please check all fields.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-event-form">
      <div className="form-grid">
        <div className="input-group">
          <label>EVENT TITLE</label>
          <input 
            type="text" 
            placeholder="What's the event called?" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            required 
          />
        </div>
        <div className="input-group">
          <label>LOCATION</label>
          <input 
            type="text" 
            placeholder="Where is it happening?" 
            value={formData.location} 
            onChange={(e) => setFormData({...formData, location: e.target.value})} 
            required 
          />
        </div>
        <div className="input-group">
          <label>DATE</label>
          <input 
            type="date" 
            value={formData.date} 
            onChange={(e) => setFormData({...formData, date: e.target.value})} 
            required 
          />
        </div>
        
        {/* --- IMAGE URL WITH TOOLTIP --- */}
        <div className="input-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
            <label style={{ margin: 0 }}>COVER IMAGE URL</label>
            <span 
              title="To get a valid link: Right-click an image on a site like Unsplash and select 'Copy Image Address'. Avoid search engine redirect links!" 
              style={{ 
                cursor: 'help', 
                fontSize: '14px', 
                color: '#f39c12',
                background: '#fdf2e2',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
            >
              ?
            </span>
          </div>
          <input 
            type="text" 
            placeholder="Paste direct link (e.g. https://.../image.jpg)" 
            value={formData.imageUrl} 
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
          />
        </div>
      </div>

      {/* --- IMAGE PREVIEW SECTION --- */}
      {formData.imageUrl && (
        <div className="image-preview-container" style={{ margin: '15px 0', textAlign: 'center' }}>
          <img 
            src={formData.imageUrl} 
            alt="Event Preview" 
            style={{ 
              width: '100%', 
              maxHeight: '200px', 
              objectFit: 'cover', 
              borderRadius: '8px',
              border: '1px solid #ddd' 
            }} 
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600x200?text=Invalid+Image+URL+Direct+Links+Only";
            }}
          />
          <p style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
            Preview (If this doesn't look right, try a direct link ending in .jpg or .png)
          </p>
        </div>
      )}

      <div className="input-group full-width">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ margin: 0 }}>DESCRIPTION</label>
          <button 
            type="button" 
            onClick={handleGenerateAIDescription}
            disabled={isGenerating}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#f39c12', 
              cursor: isGenerating ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isGenerating ? "⌛ THINKING..." : "✨ AI AUTO-FILL"}
          </button>
        </div>
        <textarea 
          placeholder="Give us the details..." 
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
          required 
          rows="4"
        />
      </div>
      
      <button type="submit" className="publish-btn">PUBLISH EVENT</button>
    </form>
  );
}

export default CreateEvent;