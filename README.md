# 🎓 Project 2: Interactive Flashcard Application
## 🚀 Overview
This project is a web-based flashcard application built with React and Vite. The application allows a user to study a set of trivia cards in a non-repeating, randomized order. It features a responsive 3D card-flip animation, navigation controls, and an input field for checking answers.

# ✨ Features Implemented
The table below confirms all required features for Project 2 (Part 1 and Part 2 has been implemented.)

## Part 1: Core Functionality and Display
### Features

Title, description, and total card count displayed [x]

Single card displayed at a time (non-repeating sequence) [x]

Only one half of the information pair is displayed initially [x]

3D Card Flip: Clicking the card flips it to reveal the answer [x]

Next button displays a new card [x]

Previous button returns to the last card viewed [x]

App detects and displays "Study Complete" message at the end [x]


## Part 2: Interaction, Validation, and Navigation
### Features

Dedicated user input field and submit button [x]

Navigation Constraints: Back/Next buttons disabled at start/end of deck [x]

App provides clear visual feedback (Correct/Incorrect) after submission [x]

Fuzzy Matching: Answer checking handles case, punctuation, and multiple accepted correct answers [x]

Visual Countdown Timer: After a correct guess, a 5-second visual countdown is displayed before auto-advancing [x]

## 🌟 Advanced Features (Stretch Goals)
This section highlights the additional features implemented for a complete, game-like user experience:

🏆 Streak Counter: Tracks the user's Current Streak of correct answers and updates the Longest Streak high score.

🔀 Shuffle Functionality: A dedicated button allows the user to randomize the card order at any time, restarting the session.

🖼️ Image Support: Cards are configured to display a relevant image on the question side (if provided in CARD_DATA).

🎨 Theming: The application utilizes a "General Food Knowledge" theme [replacing the "General Knowledge" questions, complete with a static background image and a custom color scheme.


## 🖼️ Walkthrough
This GIF demonstrates the application's key functionality, including the 3D flip, navigation, and answer checking.

<img width="600" height="540" alt="image" src="![a8dnp5](https://github.com/user-attachments/assets/037d73c8-880d-4074-8645-49c76cb0d417)
" />


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
