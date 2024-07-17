import React, { } from 'react';



const QuestionSection = ({ handleAskQuestion, headertext, numberOfQuestions,
    handleNewestClick, handleActiveClick, handleUnansweredClick, isRegistered }) => {

    return (
        <div>
            {true && (
                <>
                    <div className="questions-header">
                        <h2 id="pghdr">{headertext}</h2>
                        {/* Attach the handleAskQuestion function to the onClick event of the button */}
                        {isRegistered && <button className="btn ask-question" id="ask-question" onClick={handleAskQuestion}>Ask Question</button>}

                    </div>
                    <div className="question-stats">
                        <span className="total-questions" id="total-questions">{numberOfQuestions} questions</span>
                        <div className="question-filters">
                            <button className="btn filter" id="newest" onClick={handleNewestClick}>Newest</button>
                            <button className="btn filter" id="active" onClick={handleActiveClick}>Active</button>
                            <button className="btn filter" id="unanswered" onClick={handleUnansweredClick}>Unanswered</button>
                        </div>
                    </div>
                </>
            )}
            {/* The dynamic content for questions will be inserted here */}

        </div>
    );
};

export default QuestionSection;
