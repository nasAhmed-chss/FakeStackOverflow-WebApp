import React from 'react';
import TagList from './taglist';
import formatDate from './formdate';

const Question = ({ question, tags, onSelect }) => {
    // Handle click event on the question title
    const handleTitleClick = () => {
        onSelect(question);
    };

    return (
        <div className="question">
            <div className="question-info">
                <span>{question.answers.length} answers</span>
                <span>{question.views} views</span>
            </div>
            <div className="titleAndTags">
                <h3 className="question-title" onClick={handleTitleClick}>{question.title}</h3>
                <span style={{ marginBottom: '5px' }}>{question.summary}</span>
                <TagList tagIds={question.tags} tags={tags} />
            </div>
            <div className="question-meta">
                <div>
                    <span className="asker" style={{ color: 'red' }}>{question.asked_by}</span>
                    <span> asked {formatDate(new Date(question.ask_date_time))}</span>
                </div>
                <span style={{ color: 'blue' }}>{question.votes} votes</span>
                {/* <div className='vote-button-container'>
                    <button className='btn'>Up Vote</button>
                    <button className='btn'>Up Down</button>
                </div> */}
            </div>
        </div>
    );
};

export default Question;