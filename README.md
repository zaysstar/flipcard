# 🎓 Project 2: Interactive Flashcard Application
## 🚀 Overview
This project is a web-based flashcard application built with React and Vite. The application allows a user to study a set of trivia cards in a non-repeating, randomized order. It features a responsive 3D card-flip animation, navigation controls, and an input field for checking answers.

## ✨ Features Implemented
The table below confirms all required features for Project 2 (Part 1 has been implemented; Part 2 will be coming soon.)

### Part 1: Core Functionality
Feature	Implemented
Title of card set is displayed	[x]
A short description of the card set is displayed	[x]
A list of card pairs is created (CARD_DATA in App.jsx)	[x]
The total number of cards in the set is displayed	[x]
A single card at a time is displayed	[x]
Only one half of the information pair is displayed at a time	[x]
Clicking on the card flips it over, showing the back	[x]
Clicking on a flipped card again flips it back, showing the front	[x]
Clicking on the Next button displays a new card	[x]
Cards are shown in a non-repeating sequence	[x]
The app detects when the last card is reached	[x]
The app displays a "Study Complete" message at the end	[x]
Navigation includes a "Previous Card" button	[x]
Users can enter an answer in a dedicated input field	[x]
App provides feedback (Correct/Incorrect) after submission	[x]
Answer checking uses basic matching (case/whitespace insensitive)	[x]

## 🖼️ Walkthrough
This GIF demonstrates the application's key functionality, including the 3D flip, navigation, and answer checking.

\

## 🛠️ Technology Stack
Framework: React (using functional components and Hooks)

Build Tool: Vite

State Management: useState() (for current card position, flip status, and user input)

Styling: CSS3 for responsive design and 3D transforms (rotateY) for the flip animation.


## ⚙️ How to Run Locally
1. Clone the repository:

Bash
git clone <YOUR_GITHUB_REPO_URL>
cd <your-project-folder>

2. Install dependencies:

Bash
npm install


3. Start the development server:

Bash
npm run dev

The application should open automatically in your browser (e.g., http://localhost:5173).