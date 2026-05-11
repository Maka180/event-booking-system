const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * CONFIGURATION
 * Note: OpenAI uses the fallback for categorization due to quota.
 * Gemini handles free-tier description generation.
 */

// Initialize OpenAI
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

// Initialize Gemini (Free Tier)
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
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
    // If OpenAI hits a 429 quota error, silently use the fallback
    return fallbackCategorize(description, title);
  }
};

/**
 * FEATURE 2: AI Description Generator (Powered by Gemini)
 * Generates catchy event text for the user.
 */
exports.generateAIDescription = async (title) => {
  if (!genAI) {
    console.error("❌ [GEMINI-LOG]: API Key missing.");
    return "Ready to host an amazing event? Let's get started!";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Write a short, high-energy 2-sentence description for an event titled: "${title}". Include a call to action.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("⚠️ [GEMINI-LOG]: Generation failed:", error.message);
    
    return "Join us for an incredible experience you won't want to miss!";
  }
};



function fallbackCategorize(description, title) {
  const content = (title + " " + description).toLowerCase();
  const has = (word) => new RegExp(`\\b${word}\\b`, 'i').test(content);

  // 1. FITNESS
  if (has('gym') || has('workout') || has('fitness') || has('lift') || has('fit') || has('training') || has('bodyweight') || has('exercise')) {
    console.log("🛠️ [FALLBACK]: Fitness");
    return 'Fitness';
  }

  // 2. SOCIAL
  if (has('gathering') || has('meetup') || has('social') || has('thing') || has('hangout') || has('party') || has('worship') || has('church') || has('meeting')) {
    console.log("🛠️ [FALLBACK]: Social");
    return 'Social';
  }

  // 3. TECHNOLOGY
  if (has('code') || has('bootcamp') || has('software') || has('tech') || has('react') || has('node') || has('mern') || has('mongodb') || has('kafka') || has('api')) {
    console.log("🛠️ [FALLBACK]: Technology");
    return 'Technology';
  }

  // 4. EDUCATION
  if (has('career') || has('fair') || has('nwu') || has('workshop') || has('learn') || has('education') || has('varsity') || has('graduate') || has('study')) {
    console.log("🛠️ [FALLBACK]: Education");
    return 'Education';
  }

  // 5. ENTERTAINMENT
  if (has('movie') || has('film') || has('cinema') || has('music') || has('show') || has('concert') || has('dj')) {
    console.log("🛠️ [FALLBACK]: Entertainment");
    return 'Entertainment';
  }

  console.log("🛠️ [FALLBACK]: General");
  return 'General';
}