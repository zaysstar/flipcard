import { useState } from 'react';

function Flashcard({ question, answer }) {
  // State to control the flip (false = front/question, true = back/answer)
  const [isFlipped, setIsFlipped] = useState(false);

  // Function to toggle the state when clicked
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
    return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        
        {/* FRONT SIDE (QUESTION) */}
        <div className="card-content question-side">
        <p className="card-text">{question}</p>
        </div>
        
        {/* BACK SIDE (ANSWER) */}
        <div className="card-content answer-side">
        <p className="card-text">{answer}</p>
        </div>

    </div>
 );
}

export default Flashcard;