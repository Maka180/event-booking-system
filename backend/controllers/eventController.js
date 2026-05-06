const Event = require('../models/event');
// Import both categorization and description services
const { categorizeEvent, generateAIDescription } = require('../services/aiService');

// @desc    NEW: Generate AI description using Gemini
// @route   POST /api/events/ai/describe
exports.generateDescription = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: "Please provide a title" });
    }

    const description = await generateAIDescription(title);
    res.status(200).json({ description });
  } catch (error) {
    console.error("AI Description Error:", error);
    res.status(500).json({ message: "Failed to generate description" });
  }
};

// @desc    Create new event with AI categorization
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  const { title, description, location, date, imageUrl } = req.body;
  
  try {
    // 1. Generate AI Category based on title and description
    // Uses OpenAI with a local heuristic fallback if quota is exceeded
    const category = await categorizeEvent(description, title);
    
    console.log(`✨ Result for "${title}":`, category);

    // 2. Create the event in the database
    const event = await Event.create({
      title,
      description,
      location,
      date,
      imageUrl,
      category, 
      creator: req.user._id, 
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events
// @route   GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('creator', 'name email');
    res.json(events);
  } catch (error) {
    console.error("Get Events Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book an event (Join)
// @route   PUT /api/events/:id/book
exports.bookEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already booked this event' });
    }

    event.attendees.push(req.user._id);
    await event.save();

    res.status(200).json({ message: 'Event booked successfully', event });
  } catch (error) {
    console.error("Book Event Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unjoin an event
// @route   PUT /api/events/:id/unjoin
exports.unjoinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== req.user._id.toString()
    );

    await event.save();
    res.status(200).json({ message: 'Unjoined successfully', event });
  } catch (error) {
    console.error("Unjoin Event Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    await event.deleteOne();
    res.status(200).json({ message: 'Event removed successfully' });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ message: error.message });
  }
};