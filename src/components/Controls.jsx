function Controls({ 
  onNextClick, 
  onPreviousClick,
  isFirstCard,       // Used to disable the Previous button
  isLastCard,        // Used to disable the Next button
  userInput,       
  onInputChange,   
  onSubmitAnswer,  
  isCorrect        
}) {
  
  return (
    <div className="card-controls">
      
      {/* --- Answer Input and Submission --- */}
      <div className="answer-section">
        <input
          type="text"
          value={userInput}
          onChange={onInputChange}
          placeholder="Type your answer here..."
        />
        <button 
          onClick={onSubmitAnswer} 
          disabled={!userInput.trim() || isCorrect === true} // Disable if empty or already correct
          className="submit-button"
        >
          Check Answer
        </button>
      </div>

      {/* --- Feedback Display --- */}
      {isCorrect !== null && (
        <p className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect 
            ? '✅ Correct! Move to the next card.' 
            : '❌ Incorrect. Try again or flip the card to see the answer.'
          }
        </p>
      )}

      {/* --- Navigation Buttons --- */}
      <div className="navigation-buttons">
        <button 
          onClick={onPreviousClick} 
          disabled={isFirstCard} // Disabled when at the start of the deck
          className="previous-button"
        >
          Previous Card
        </button>

        <button 
          onClick={onNextClick} 
          disabled={isLastCard} // Disabled when at the end of the deck
          className="next-button"
        >
          {isLastCard ? "Finished!" : "Next Card"}
        </button>
      </div>
      
    </div>
  );
}

export default Controls;