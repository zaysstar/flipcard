import React, { useState, useCallback, useMemo } from 'react';
// Removed: import './App.css'; // This line causes the compilation error in this environment

// =================================================================
// 1. HELPER FUNCTIONS
// =================================================================

// Fisher-Yates Shuffle Algorithm
const shuffleArray = (array) => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Fuzzy Matching Helper (Stretch Feature: Now handles multiple correct answers)
const isFuzzyMatch = (userInput, targetAnswer) => {
    // 1. Helper to remove punctuation and standardize case/whitespace
    const cleanStr = (str) => str.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();

    const cleanUser = cleanStr(userInput);
    
    // 2. Determine if the target answer is a single string or an array of alternates
    const possibleAnswers = Array.isArray(targetAnswer) ? targetAnswer : [targetAnswer];

    // 3. Check the user input against all cleaned possible answers
    return possibleAnswers.some(answer => cleanUser === cleanStr(answer));
};

// =================================================================
// 2. STATIC DATA (Food Knowledge)
// =================================================================

const CARD_DATA = [
    { id: 1, question: "What fruit is famously the base of guacamole?", answer: ["Avocado", "Avocados"] },
    { id: 2, question: "What is the primary ingredient in hummus?", answer: ["Chickpeas", "Garbanzo Beans", "Garbanzos"] },
    { id: 3, question: "Which white sauce is the base for a traditional lasagna?", answer: ["Béchamel", "Bechamel", "Bechamel Sauce", "Béchamel Sauce"] },
    { id: 4, question: "What spice comes from the stigma of the Crocus flower?", answer: "Saffron" },
    { id: 5, question: "What type of vegetable has varieties called 'Nantes' and 'Imperator'?", answer: ["Carrot", "Carrots"] },
    { id: 6, question: "Which acid gives citrus fruits their sour/tart flavor?", answer: ["Citric Acid", "Citric"] }, // Added alternates
    { id: 7, question: "What country invented the pizza?", answer: ["Italy"] },
    { id: 8, question: "What is the most common flavor of ice cream in the United States?", answer: ["Vanilla"] },
    { id: 9, question: "Which grain is used to make traditional risotto?", answer: ["Arborio Rice", "Arborio"] },
    { id: 10, question: "What type of pastry is used to make a traditional baklava?", answer: ["Phyllo Dough", "Phyllo Pastry", "Phyllo","Filo Dough", "Filo Pastry", "Filo"] },
    { id: 11, question: "What is the term for cooking food slowly in liquid at a low temperature?", answer: ["Poaching"] },
    { id: 12, question: "Which vitamin is most abundant in citrus fruits?", answer: ["Vitamin C", "C", "Ascorbic Acid"] }, // Added alternate
    { id: 13, question: "What is the main ingredient in the Middle Eastern dish, \"tabbouleh\"?", answer: ["Bulgur Wheat", "Bulgur"] },
    { id: 14, question: "What type of sugar is commonly used in baking and dissolves quickly?", answer: ["Caster Sugar", "Caster", "Superfine Sugar", "Superfine"] }, // Added alternate
    { id: 15, question: "What is the name of the process that turns grapes/grape juice into wine?", answer: ["Fermentation"] },
    { id: 16, question: "Which herb is traditionally used in pesto sauce?", answer: ["Basil"] },
    { id: 17, question: "What is tofu made from?", answer: ["Soybeans", "Soy"] }, // Added alternate
    { id: 18, question: "What is the name of the Japanese dish consisting of vinegared rice and raw fish?", answer: ["Sushi"] },
    { id: 19, question: "Which fruit has varieties called 'Granny Smith' and 'Fuji'?", answer: ["Apple", "Apples"] },
    { id: 20, question: "What is the main ingredient in traditional French ratatouille?", answer: ["Eggplant", "Aubergine"] }, // Added alternate
    { id: 21, question: "What type of pasta is shaped like small rice grains and often used in soups?", answer: ["Orzo"] },
    { id: 22, question: "What is the name of the Mexican dish made with corn tortillas filled with meat, cheese, and other ingredients?", answer: ["Taco", "Tacos"] },
    { id: 23, question: "Which fruit is known as the 'king of fruits' in Southeast Asia?", answer: ["Durian"] },
    { id: 24, question: "What type of nut is used to make traditional marzipan?", answer: ["Almonds", "Almond"] },
    { id: 25, question: "What is the name of the Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cheese?", answer: ["Tiramisu"] },
    { id: 26, question: "How many calories are in one gram of fat?", answer: ["9", "Nine"] }, // Added alternate
    { id: 27, question: "What is the main ingredient in the Indian dish 'palak paneer'?", answer: ["Spinach", "Paneer"] }, // Added alternate
    { id: 28, question: "What is the name of the French cooking technique that involves cooking food in a vacuum-sealed bag in a water bath?", answer: ["Sous Vide", "Sous-vide"] },
    { id: 29, question: "Which fruit is known for its high potassium content and is often recommended for heart health?", answer: ["Banana", "Bananas"] },
    { id: 30, question: "What vitamin is also known as 'cyanocobalamin'?", answer: ["Vitamin B12", "B12"] }, // Added alternate
];

// =================================================================
// 3. NESTED COMPONENTS
// =================================================================

/**
 * Header Component: Displays title and streak statistics.
 */
const Header = ({ title, totalCards, currentCardPosition, currentStreak, longestStreak }) => (
    <div className="app-header">
        <h1>{title}</h1>
        <p className="description">Test your expertise in all things culinary!</p>
        <p className="card-count">Card: {currentCardPosition + 1} of {totalCards}</p>
        <div className="stats-container">
            <div className="stat-box">
                Current Streak: <strong>{currentStreak}</strong>
            </div>
            <div className="stat-box">
                Longest Streak: <strong>{longestStreak}</strong>
            </div>
        </div>
    </div>
);

/**
 * Flashcard Component: Renders the flippable card UI.
 */
const Flashcard = ({ question, answer, isFlipped, onRevealAnswer }) => {
    // If the answer is an array, display the primary answer for simplicity
    const displayAnswer = Array.isArray(answer) ? answer[0] : answer;

    return (
        <div 
            className={`flashcard-container ${isFlipped ? 'flipped' : ''}`}
        >
            <div className="flashcard-inner-wrapper">
                {/* Card Front: Question Side */}
                <div className="card-content question-side">
                    <span className="card-text">{question}</span>
                </div>
                {/* Card Back: Answer Side */}
                <div className="card-content answer-side">
                    <span className="card-text">{displayAnswer}</span>
                    {/* Hide Answer button is shown only on the back face */}
                    <button 
                        onClick={onRevealAnswer}
                        style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#dc3545' }}
                    >
                        Hide Answer
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Controls Component: Manages user input, submit action, and navigation.
 */
const Controls = ({ 
    onNextClick, onPreviousClick, isFirstCard, isLastCard,
    userInput, onInputChange, onSubmitAnswer, isCorrect,
    onShuffle
}) => {
    
    // Determine input border style based on answer correctness
    const inputClassName = useMemo(() => {
        if (isCorrect === true) return 'correct-border';
        if (isCorrect === false) return 'incorrect-border';
        return '';
    }, [isCorrect]);

    // Determine feedback message
    let feedbackText = '';
    let feedbackClass = '';
    if (isCorrect === true) {
        feedbackText = "✅ Correct! Auto-advancing to the next card.";
        feedbackClass = 'correct';
    } else if (isCorrect === false) {
        feedbackText = "❌ Incorrect. Try again or reveal the answer.";
        feedbackClass = 'incorrect';
    }

    return (
        <div className="controls-container">
            
            <div className="utility-buttons">
                <button onClick={onShuffle}>Shuffle Deck</button>
            </div>

            {/* Visual Feedback Message */}
            {feedbackText && (
                <div className={`feedback ${feedbackClass}`}>{feedbackText}</div>
            )}

            {/* Input and Submit */}
            <div className="answer-section">
                <input
                    type="text"
                    placeholder="Enter your guess..."
                    value={userInput}
                    onChange={onInputChange}
                    className={inputClassName}
                    disabled={isCorrect === true} // Disable input on successful guess
                    onKeyDown={(e) => { // Allow Enter key to submit
                        if (e.key === 'Enter' && userInput && isCorrect !== true) {
                            onSubmitAnswer();
                        }
                    }}
                />
                <button 
                    onClick={onSubmitAnswer} 
                    className="submit-button"
                    disabled={!userInput || isCorrect === true}
                >
                    Submit
                </button>
            </div>
            
            {/* Navigation Buttons */}
            <div className="navigation-buttons">
                <button 
                    onClick={onPreviousClick} 
                    disabled={isFirstCard} 
                    className="previous-button"
                >
                    &larr; Back
                </button>
                <button 
                    onClick={onNextClick} 
                    disabled={isLastCard} 
                    className="next-button"
                >
                    Next &rarr;
                </button>
            </div>
        </div>
    );
};

// =================================================================
// 4. MAIN APPLICATION COMPONENT
// =================================================================

function App() {
    // 1. PRIMARY STATE 
    const [cardSet] = useState(CARD_DATA); 
    const initialDeck = useMemo(() => cardSet.map(card => card.id), [cardSet]);
    
    const [shuffledDeck, setShuffledDeck] = useState(() => shuffleArray(initialDeck)); 
    
    const [currentCardPosition, setCurrentCardPosition] = useState(0); 
    const [userInput, setUserInput] = useState('');
    const [isCorrect, setIsCorrect] = useState(null); 
    const [isFlipped, setIsFlipped] = useState(false); 
    const [isStudyComplete, setIsStudyComplete] = useState(false);

    // Streak State (Stretch Feature)
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);

    // 2. DERIVED STATE
    const currentCardId = shuffledDeck[currentCardPosition];
    const currentCard = cardSet.find(card => card.id === currentCardId);
    
    const isLastCard = currentCardPosition === shuffledDeck.length - 1;
    const isFirstCard = currentCardPosition === 0;

    // Reset function called when navigating or shuffling
    const resetCardState = useCallback(() => {
        setUserInput('');
        setIsCorrect(null);
        setIsFlipped(false);
        setIsStudyComplete(false);
    }, []);

    // 3. LOGIC/EVENT HANDLERS

    const handleNextCard = useCallback(() => {
        if (currentCardPosition < shuffledDeck.length - 1) {
            setCurrentCardPosition(prevPosition => prevPosition + 1);
            resetCardState();
        } else {
            setIsStudyComplete(true);
        }
    }, [currentCardPosition, shuffledDeck.length, resetCardState]);

    const handlePreviousCard = useCallback(() => {
        if (currentCardPosition > 0) {
            setCurrentCardPosition(prevPosition => prevPosition - 1);
            resetCardState();
        }
    }, [currentCardPosition, resetCardState]);
    
    const handleShuffle = useCallback(() => {
        const newShuffledDeck = shuffleArray(initialDeck);
        setShuffledDeck(newShuffledDeck);
        setCurrentCardPosition(0);
        setCurrentStreak(0);
        setLongestStreak(0); 
        resetCardState();
    }, [initialDeck, resetCardState]);
    
    const handleInputChange = useCallback((event) => {
        setUserInput(event.target.value);
        setIsCorrect(null); 
        setIsFlipped(false); 
    }, []);
    
    const handleSubmitAnswer = useCallback(() => {
        const isMatch = isFuzzyMatch(userInput, currentCard.answer);
        
        if (isMatch) {
            setIsCorrect(true); 
            setIsFlipped(true); 
            
            // Streak Logic
            const newStreak = currentStreak + 1;
            setCurrentStreak(newStreak);
            if (newStreak > longestStreak) {
                setLongestStreak(newStreak);
            }

            // Auto-advance with 5-second delay (5000ms)
            setTimeout(() => {
                handleNextCard();
            }, 5000); // <-- THIS IS THE CHANGE

        } else {
            setIsCorrect(false); 
            setCurrentStreak(0); 
        }
    }, [userInput, currentCard, currentStreak, longestStreak, handleNextCard]);

    const handleRevealAnswer = useCallback(() => {
        setIsFlipped(prev => !prev);
    }, []);


    // 4. COMPONENT RENDERING
    return (
        <div className="App-container">
            <style jsx="true">{`
                /* ==================================== */
                /* Global Styles (Mimics index.css)     */
                /* ==================================== */

                body {
                    min-height: 100vh;
                    width: 100vw;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    padding: 0;
                    margin: 0;
                    
                    /* --- START: BACKGROUND IMAGE CHANGES --- */
                    background-image: url('https://images.unsplash.com/photo-1543353071-10c8ba85a904?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9vZCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D'); /* 1. Replace this URL with your actual image */
                    background-size: cover; /* 2. Ensures the image covers the entire body */
                    background-attachment: fixed; /* 3. Keeps the image fixed while content scrolls */
                    background-position: center center;
                    /* --- END: BACKGROUND IMAGE CHANGES --- */
                    
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: #213547;
                }
                
                /* ==================================== */
                /* Application Component Styles (App.css) */
                /* ==================================== */

                .App-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 40px 20px;
                    width: 100%;
                    max-width: 650px;
                    background-color: #f4f4f9; 
                    color: #213547;
                    min-height: 100vh;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
                }

                h1 {
                    color: #007bff;
                }

                /* Base button style */
                button {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1em;
                    font-weight: 600;
                    transition: background-color 0.2s, transform 0.1s, opacity 0.2s;
                }

                button:hover:not(:disabled) {
                    background-color: #45a049;
                    transform: translateY(-1px);
                }

                button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    background-color: #a0a0a0;
                }

                /* ==================================== */
                /* Header & Stats Section Styles     */
                /* ==================================== */

                .app-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #eee;
                    width: 100%;
                }

                .app-header h1 {
                    font-size: 2.5em;
                    margin-bottom: 0.2em;
                    color: #333;
                }

                .stats-container {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    margin-top: 15px;
                }

                .stat-box {
                    padding: 10px 15px;
                    border-radius: 8px;
                    background-color: #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    font-size: 0.9em;
                    font-weight: 500;
                }

                .stat-box strong {
                    color: #007bff;
                    font-size: 1.2em;
                    display: block;
                }

                /* ============================================================== */
                /* FLASHCARD FLIP EFFECT STYLES                              */
                /* ============================================================== */

                .flashcard-container {
                    perspective: 1000px;
                    width: 100%;
                    max-width: 450px;
                    height: 300px;
                    position: relative;
                    margin: 30px auto;
                    background-color: transparent;
                    border-radius: 12px;
                }

                .flashcard-inner-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                    border-radius: 12px;
                    transition: transform 0.6s;
                    transform-style: preserve-3d;
                }

                .flashcard-container.flipped .flashcard-inner-wrapper {
                    transform: rotateY(180deg);
                }

                .card-content {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 12px;
                    backface-visibility: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    padding: 20px;
                    box-sizing: border-box;
                    border: 3px solid #007bff;
                }

                .card-text {
                    font-size: 1.5em;
                    font-weight: bold;
                    user-select: none;
                }

                .card-content.question-side {
                    background-color: #fff;
                    color: #333;
                }

                .card-content.answer-side {
                    transform: rotateY(180deg);
                    background-color: #e0f7fa;
                    color: #00796b;
                }

                /* ==================================== */
                /* Controls (Input, Submit, Nav)     */
                /* ==================================== */

                .controls-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    max-width: 450px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .answer-section {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    width: 100%;
                }

                .answer-section input {
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                    flex-grow: 1;
                    font-size: 1em;
                    transition: border-color 0.3s;
                }

                /* Input feedback borders */
                .answer-section input.correct-border {
                    border-color: #28a745;
                    box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
                }

                .answer-section input.incorrect-border {
                    border-color: #dc3545;
                    box-shadow: 0 0 5px rgba(220, 53, 69, 0.5);
                }

                .submit-button {
                    flex-shrink: 0;
                }

                /* Visual Feedback */
                .feedback {
                    font-weight: bold;
                    padding: 10px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    text-align: center;
                    width: 100%;
                }

                .feedback.correct {
                    background-color: #e6ffe6;
                    color: #008000;
                    border: 1px solid #008000;
                }

                .feedback.incorrect {
                    background-color: #ffe6e6;
                    color: #cc0000;
                    border: 1px solid #cc0000;
                }


                /* Navigation buttons */
                .navigation-buttons {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    margin-top: 20px;
                }

                .previous-button {
                    background-color: #6c757d;
                }
                .previous-button:hover:not(:disabled) {
                    background-color: #5a6268;
                }


                /* Shuffle and other utility buttons */
                .utility-buttons {
                    margin-bottom: 20px;
                }

                .utility-buttons button {
                    background-color: #ffc107;
                    color: #333;
                    padding: 8px 15px;
                    font-size: 0.9em;
                }

                .utility-buttons button:hover {
                    background-color: #e0a800;
                }


                /* Study Complete Screen */
                .study-complete-message {
                    padding: 50px;
                    background-color: #fff;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    margin-top: 50px;
                }

                .study-complete-message h2 {
                    color: #28a745;
                }
            `}</style>

            {/* 1. Header: Displays metadata and streaks */}
            <Header 
                title="General Food Knowledge"
                totalCards={shuffledDeck.length}
                currentCardPosition={currentCardPosition}
                currentStreak={currentStreak}
                longestStreak={longestStreak}
            />
            
            {isStudyComplete ? (
                // RENDER END SCREEN
                <div className="study-complete-message">
                    <h2>Study Session Complete! 🎉</h2>
                    <p>You reviewed all {shuffledDeck.length} cards with a longest streak of {longestStreak}!</p>
                    <button onClick={handleShuffle}>Start New Shuffled Session</button>
                </div>
            ) : (
                <>
                    {/* 2. Flashcard: Displays the current card's content */}
                    <Flashcard 
                        key={currentCard.id} 
                        question={currentCard.question} 
                        answer={currentCard.answer} 
                        isFlipped={isFlipped}
                        onRevealAnswer={handleRevealAnswer}
                    />

                    {/* Manual Reveal Button (Visible if card hasn't been successfully guessed) */}
                    {isCorrect !== true && (
                        <button 
                            onClick={handleRevealAnswer}
                            style={{ margin: '10px 0', padding: '8px 15px', backgroundColor: '#dc3545' }}
                        >
                            {isFlipped ? 'Hide Answer' : 'Reveal Answer'}
                        </button>
                    )}
                    
                    {/* 3. Controls: Handles all navigation and input events */}
                    <Controls 
                        // Navigation Props
                        onNextClick={handleNextCard} 
                        onPreviousClick={handlePreviousCard}
                        isFirstCard={isFirstCard} 
                        isLastCard={isLastCard}
                        
                        // Input/Answer Props
                        userInput={userInput}
                        onInputChange={handleInputChange}
                        onSubmitAnswer={handleSubmitAnswer}
                        isCorrect={isCorrect}
                        
                        // Utility Props
                        onShuffle={handleShuffle}
                    />
                </>
            )}
        </div>
    );
}

export default App;