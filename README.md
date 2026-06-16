# Android Club Collaboration Hub - Kanban System

A real-time project management and collaboration workspace designed for student clubs. Built on top of the Next.js and MongoDB foundation for the Technical Department Recruitment 2026.

## Live Deployment Link
👉 **[INSERT YOUR VERCEL LIVE URL HERE]**

## Features Implemented
1. **Core Kanban Transformation:** Converted flat item lists into a dynamic, 3-column system consisting of **To Do**, **In Progress**, and **Done** workflows with instant progressive controls.
2. **Task Filtering & Search Indexing:** Added a real-time responsive client-side search query feature allowing users to filter board items instantly by character-matching titles or details.
3. **Advanced Categorization (Priority & Tags):** Extended database records to hold urgency levels (High, Medium, Low) paired with customized project category tracking tags (e.g., #Frontend, #Bug).

## Tech Stack
- **Framework:** Next.js (React)
- **Database:** MongoDB Atlas via Mongoose ODM
- **Styling:** Tailwind CSS

## Local Installation
1. Clone this repository: `git clone <your-repo-url>`
2. Install necessary dependencies: `npm install`
3. Create a `.env.local` configuration sheet and append your backend string:
   `MONGODB_URI=your_mongodb_connection_string`
4. Run locally: `npm run dev`