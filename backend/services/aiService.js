const { OpenAI } = require('openai');
const Groq = require('groq-sdk');

/**
 * CONFIGURATION
 * OpenAI handles categorization (with fallback).
 * Groq (free) handles description generation.
 */

// Initialize OpenAI
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

// Initialize Groq (Free Tier)
const groq = process.env.GROQ_API_KEY 
  ? new Groq({ apiKey: process.env.GROQ_API_KEY }) 
  : null;

/**
 * FEATURE 1: Event Categorization (Hybrid AI/Heuristic)
 */
exports.categorizeEvent = async (description, title = '') => {
  if (!openai) {
    return fallbackCategorize(description, title);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Categorize the event into exactly one word: Technology, Fitness, Social, Entertainment, Education." },
        { role: "user", content: `Title: "${title}". Desc: "${description}"` }
      ],
      max_tokens: 5,
      temperature: 0.3,
    });
    
    return response.choices[0].message.content.trim().replace(/[^\w]/g, '');
  } catch (error) {
    return fallbackCategorize(description, title);
  }
};

/**
 * FEATURE 2: AI Description Generator (Powered by Groq - Free)
 * Generates catchy event text for the user.
 */
exports.generateAIDescription = async (title) => {
  if (!groq) {
    console.error("❌ [GROQ-LOG]: API Key missing.");
    return "Ready to host an amazing event? Let's get started!";
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Write a short, high-energy 2-sentence description for an event titled: "${title}". Include a call to action.`
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("⚠️ [GROQ-LOG]: Generation failed:", error.message);
    return "Join us for an incredible experience you won't want to miss!";
  }
};


function fallbackCategorize(description, title) {
  const content = (title + " " + description).toLowerCase();
  const has = (word) => new RegExp(`\\b${word}\\b`, 'i').test(content);

  if (has('gym') || has('workout') || has('fitness') || has('lift') || has('fit') || has('training') || has('bodyweight') || has('exercise')) {
    console.log("🛠️ [FALLBACK]: Fitness");
    return 'Fitness';
  }
  if (has('gathering') || has('meetup') || has('social') || has('thing') || has('hangout') || has('party') || has('worship') || has('church') || has('meeting')) {
    console.log("🛠️ [FALLBACK]: Social");
    return 'Social';
  }
  if (has('code') || has('bootcamp') || has('software') || has('tech') || has('react') || has('node') || has('mern') || has('mongodb') || has('kafka') || has('api')) {
    console.log("🛠️ [FALLBACK]: Technology");
    return 'Technology';
  }
  if (has('career') || has('fair') || has('nwu') || has('workshop') || has('learn') || has('education') || has('varsity') || has('graduate') || has('study')) {
    console.log("🛠️ [FALLBACK]: Education");
    return 'Education';
  }
  if (has('movie') || has('film') || has('cinema') || has('music') || has('show') || has('concert') || has('dj')) {
    console.log("🛠️ [FALLBACK]: Entertainment");
    return 'Entertainment';
  }

  console.log("🛠️ [FALLBACK]: General");
  return 'General';
}