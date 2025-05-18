# My Interactive Portfolio

Welcome to the source code for my interactive personal portfolio, designed to look and feel like a desktop operating system environment. This project showcases my skills, projects, and allows for dynamic interaction through various "applications" and features.

Live Demo: https://eyobweldetensay.netlify.app/

## Key Features

*   Interactive Desktop UI:
    *   Draggable and resizable windows for different content sections (About Me, Skills, Projects, Contact).
    *   Dock for launching and managing "applications" (windows).
    *   Animated dashboard background.
*   Project Showcase:
    *   Displays a filterable list of my software projects.
    *   Each project card includes details, tags, and links to GitHub/live demos.
    *   AI-Powered Q&A: Ask questions about specific projects and get answers from an AI assistant (powered by Genkit and Google AI).
*   Developer Information:
    *   "About Me" window with my bio, education, and social links.
    *   "Skills" window detailing my technical competencies.
*   Functional Contact Form:
    *   "Contact" window with a form that submits messages to a Firebase Firestore backend.
*   Interactive Terminal:
    *   A hidden terminal (toggle with Ctrl + ~ or header button) with commands to navigate portfolio info, get jokes, etc.
    *   Command history and basic tab-completion.
*   API Explorer:
    *   A dedicated page demonstrating mock API endpoints that represent the data structure of the portfolio, useful for understanding how data might be fetched programmatically.
*   Theme Toggle: Light and dark mode support.
*   Responsive Design: Adapts to different screen sizes, with a simplified layout for mobile.

## Tech Stack

*   Frontend:
    *   Next.js (App Router)
    *   React
    *   TypeScript
    *   Tailwind CSS
    *   ShadCN UI (for UI components)
    *   Lucide React (for icons)
    *   Framer Motion (for animations and draggable windows)
*   Backend/AI:
    *   Genkit (for AI flow orchestration)
    *   Google AI (Gemini models for Q&A)
    *   Firebase Firestore (for contact form submissions)
*   Development:
    *   Node.js
    *   npm/yarn

## Setup and Local Development

To run this project locally:

1.  Clone the repository:
        git clone https://github.com/Yobil-Job/my-portfolio.git # Or your repository URL
    cd my-portfolio
    

2.  Install dependencies:
        npm install
    # or
    yarn install
    

3.  Set up Environment Variables:
    *   Create a .env.local file in the root of the project.
    *   Add the following environment variables with your actual keys:
                # For Google AI (Genkit)
        GOOGLE_API_KEY=YOUR_GOOGLE_AI_STUDIO_API_KEY

        # For Firebase
        NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
        NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
        
    *   You can get Firebase credentials from your Firebase project console.
    *   You can get a Google AI API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  Run the development server:
        npm run dev
    # or
    yarn dev
    
    The application will typically be available at http://localhost:3000 (or the port specified in your package.json, which is 9002 in this project).

5.  (Optional) Run Genkit development server (if you need to inspect flows directly):
        npm run genkit:dev
    
    This allows you to interact with Genkit flows via its local developer UI, usually at http://localhost:4000.

## Deployment

This project is configured for easy deployment on platforms like Netlify or Vercel.
*   Netlify Example:
    1.  Connect your GitHub repository to Netlify.
    2.  Netlify should auto-detect Next.js build settings (next build command, .next publish directory).
    3.  Crucial: Add all the environment variables from your .env.local (e.g., GOOGLE_API_KEY, NEXT_PUBLIC_FIREBASE_...) to your Netlify site's environment variable settings in the Netlify UI. This is necessary because .env.local is not committed to GitHub.
    4.  Deploy the site.

## Project Structure Highlights

*   src/app/: Main application routes and layout (using Next.js App Router).
*   src/components/: Reusable UI components.
    *   core/: Core layout elements like Header, Footer, DraggableWindow.
    *   dashboard/: Components specific to the main dashboard windows.
    *   ui/: ShadCN UI components.
*   src/ai/: Genkit AI flows and configuration.
    *   flows/: Contains the logic for AI interactions (e.g., answering project questions).
*   src/data/: Static data for the portfolio (developer info, project details).
*   src/lib/: Utility functions and Firebase initialization.
*   src/services/: Backend service functions (e.g., contact form submission).
*   public/: Static assets like images.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Yobil-Job/my-portfolio/issues) (replace with your actual issues link if you create one).

