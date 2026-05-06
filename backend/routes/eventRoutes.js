const express = require('express');
const router = express.Router();

// Import the 'protect' middleware
const { protect } = require('../middleware/authMiddleware');

// Import your Event model for database queries
const Event = require('../models/Event'); 

// Import controllers
const { createEvent, getEvents, bookEvent } = require('../controllers/eventController');

// Import the new AI service function
const { generateAIDescription } = require('../services/aiService');

/**
 * @route   GET /api/events
 * @desc    Public route: Anyone can see events
 */
router.get('/', getEvents);

/**
 * @route   POST /api/events/ai/describe
 * @desc    Protected route: Generates a high-energy description using Gemini
 * @note    CRITICAL: This MUST stay above any route using /:id
 */
router.post('/ai/describe', protect, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Please provide a title for the AI to analyze." });
    }

    const description = await generateAIDescription(title);
    res.json({ description });
  } catch (err) {
    console.error("AI Generation Route Error:", err);
    res.status(500).json({ message: "Failed to generate AI description" });
  }
});

/**
 * @route   POST /api/events
 * @desc    Protected route: Only logged-in users can create events
 */
router.post('/', protect, createEvent);

/**
 * @route   PUT /api/events/:id/book
 * @desc    Route to book an event (requires login)
 */
router.put('/:id/book', protect, bookEvent);

/**
 * @route   PUT /api/events/:id/unjoin
 * @desc    Removes the logged-in user from the attendees array
 */
router.put('/:id/unjoin', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Filter out the current user from the attendees list
    event.attendees = event.attendees.filter(userId => userId.toString() !== req.user.id);
    
    await event.save();
    res.json(event);
  } catch (err) {
    console.error("Unjoin Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Deletes an event (Creator only)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // SAFETY CHECK: Creator must match logged-in user
    if (!event.creator || event.creator.toString() !== req.user.id) {
      return res.status(401).json({ 
        message: "Action denied. You can only delete events you created." 
      });
    }

    await event.deleteOne();
    res.json({ message: "Event removed successfully" });
  } catch (err) {
    console.error("Delete Route Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;