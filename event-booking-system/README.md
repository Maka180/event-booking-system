# event-booking-system
A full-stack MERN event management platform featuring Google Gemini 1.5 Flash AI for automated content generation, secure JWT authentication with password recovery, and dynamic image previews.
## 🤖 AI Integration & Features

This project leverages cutting-edge AI to enhance the user experience and data consistency:

*   **✨ AI Auto-Fill (Gemini 1.5 Flash)**: Organizers provide a simple title and location, and the AI generates a professional, engaging event description automatically.
*   **🏷️ Intelligent Categorization**: A hybrid AI/heuristic approach analyzes event details to assign precise categories (e.g., "Fitness," "Tech," "Social").
*   **🖼️ Smart Image Previews**: Includes a dynamic image URL validation and preview system for real-time branding.
*   **🔐 Secure AI Infrastructure**: All AI interactions are handled via a secure Node.js backend to protect API keys and manage rate limiting.

## 🛠️ Technical Stack

*   **Frontend**: React.js (v19+), Axios, CSS3.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB Atlas (NoSQL).
*   **Authentication**: JSON Web Tokens (JWT) & Bcrypt hashing.
*   **Communication**: Nodemailer for secure Password Reset flows.

## 🚀 Key Features

*   **Secure Authentication**: Full Sign-up/Login flow with encrypted passwords and JWT-protected routes.
*   **Password Recovery**: Fully functional "Forgot Password" system sending secure reset links via Gmail.
*   **Event Lifecycle**: Users can Create, Join, Unjoin, and Delete events.
*   **Live Search**: Real-time filtering by event title, location, or date.

## 📦 Installation & Setup
```bash
   git clone https://github.com/Maka180/event-booking-system/tree/main
