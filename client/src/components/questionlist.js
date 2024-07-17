import React, { useState } from 'react';
import Question from './question';

const QuestionList = ({ questions, tags, onSelect }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const questionsPerPage = 5;

    // get current questions
    const indexOfLastQuestion = (currentPage + 1) * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    // change page
    const pageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="questions-list" id="qList">
            {currentQuestions.map((question) => (
                <Question key={question._id} question={question} tags={tags} onSelect={onSelect} />
            ))}

            <div className="page-btns">
                <button onClick={() => pageChange(currentPage - 1)} disabled={currentPage === 0}>Prev</button>
                <button onClick={() => pageChange(currentPage + 1)} disabled={indexOfLastQuestion >= questions.length}>Next</button>
            </div>
        </div>
    );
};

export default QuestionList;