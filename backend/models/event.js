const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  category: {
  type: String,
  default: 'General'
},
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  // Added field for custom event images
  imageUrl: {
    type: String,
    default: "" 
  },
  // Renamed from 'organizer' to 'creator' to match your Route & Controller logic
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  attendees: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { 
  timestamps: true 

  
});

module.exports = mongoose.model('Event', eventSchema);