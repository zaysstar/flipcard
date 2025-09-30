import './App.css';
import { useState } from 'react'; 
import Header from './components/Header';
import Flashcard from './components/Flashcard';
import Controls from './components/Controls'; 

// -----------------------------------------------------------------
// HELPER FUNCTION: Fisher-Yates Shuffle Algorithm (Outside the component)
// -----------------------------------------------------------------
const shuffleArray = (array) => {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// -----------------------------------------------------------------
// STATIC DATA 
// -----------------------------------------------------------------
const CARD_DATA = [
  { id: 1, question: "What is the capital of France?", answer: "Paris" },
  { id: 2, question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
  { id: 3, question: "What is the chemical symbol for water?", answer: "H₂O" },
  { id: 4, question: "What planet is known as the 'Red Planet'?", answer: "Mars" },
  { id: 5, question: "What is the largest ocean on Earth?", answer: "The Pacific Ocean" },
  { id: 6, question: "What is 7 times 8?", answer: "56" },
];
// -----------------------------------------------------------------


function App() {
  // 1. PRIMARY STATE
  const [cardSet] = useState(CARD_DATA); 
  
  // Shuffles the card IDs once on load to ensure no repetition
  const [shuffledDeck] = useState(() => {
    const initialIDs = cardSet.map(card => card.id);
    return shuffleArray(initialIDs);
  });
  
  // Tracks current position within the shuffledDeck array
  const [currentCardPosition, setCurrentCardPosition] = useState(0); 

  // Answer Checking State
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null); // null, true, or false
  const [isStudyComplete, setIsStudyComplete] = useState(false);

  // 2. DERIVED STATE
  const currentCardId = shuffledDeck[currentCardPosition];
  // Find the actual card object using the ID from the shuffledDeck
  const currentCard = cardSet.find(card => card.id === currentCardId);
  
  const isLastCard = currentCardPosition === shuffledDeck.length - 1;
  const isFirstCard = currentCardPosition === 0;

  
  // 3. LOGIC/EVENT HANDLERS
  
  // Handles moving to the next card in the shuffled sequence
  const handleNextCard = () => {
    if (currentCardPosition < shuffledDeck.length - 1) {
      setCurrentCardPosition(prevPosition => prevPosition + 1);
      
      // Reset input state for the new card
      setUserInput('');
      setIsCorrect(null);
    } else {
      // End of the deck reached
      setIsStudyComplete(true);
    }
  };

  // Handles moving backwards to the previous card in the sequence
  const handlePreviousCard = () => {
    if (currentCardPosition > 0) {
      setCurrentCardPosition(prevPosition => prevPosition - 1);
      
      // Reset study complete state and answer state
      setIsStudyComplete(false);
      setUserInput('');
      setIsCorrect(null);
    }
  };

  // Tracks user input
  const handleInputChange = (event) => {
    setUserInput(event.target.value);
    setIsCorrect(null);
  };
    
  // Compares user input to the correct answer (Exact Matching)
  const handleSubmitAnswer = () => {
    const sanitizedInput = userInput.trim().toLowerCase();
    const correctAnswer = currentCard.answer.trim().toLowerCase();
    
    if (sanitizedInput === correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };


  // 4. COMPONENT RENDERING
  return (
    <div className="App-container">
      
      {/* 1. Header: Displays metadata */}
      <Header 
        title="General Knowledge Flashcards"
        description="A simple study session on some general facts."
        totalCards={cardSet.length}
      />
      
      {isStudyComplete ? (
        // RENDER END SCREEN
        <div className="study-complete-message">
          <h2>Study Session Complete! 🎉</h2>
          <p>You have reviewed all {shuffledDeck.length} the cards!</p>
          <button onClick={() => {
            window.location.reload(); // Simple way to restart
          }}>Start New Session</button>
        </div>
      ) : (
        <>
          {/* 2. Flashcard: Displays the current card's content */}
          <Flashcard 
            // Key ensures React resets the card state (e.g., isFlipped) when the card changes
            key={currentCard.id} 
            question={currentCard.question} 
            answer={currentCard.answer} 
          />
          
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
          />
        </>
      )}
    </div>
  );
}

export default App;