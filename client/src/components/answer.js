import React, { useState } from 'react';
import formatDate from './formdate';
import axios from 'axios';

const Answer = ({ answer, isRegistered, user, currentView }) => {
    const [voteCount, setVoteCount] = useState(answer.votes);

    // Regular expression pattern to find occurrences of [word] followed by (link)
    const pattern = /\[(.*?)\]\s*\((https?:\/\/.*?)\)/g;

    // Replace occurrences of the pattern with a hyperlink element
    const processedText = answer.text.replace(pattern, '<a href="$2" target="_blank">$1</a>');

    // Convert the processed text to HTML
    const formattedText = <div dangerouslySetInnerHTML={{ __html: processedText }} />;
    // console.log("answered text:", answer.text);
    // console.log("answered by:", answer.ans_by);
    // console.log("answer date and time:", answer.ans_date_time);

    const handleUpVote = async () => {
        if (user.reputation < 50) {
            alert("You need a reputation of 50 or more to vote.");
            console.log('reputation: ', user.reputation);
            return;
        }
        const answerUser = await axios.get(`http://localhost:8000/post/users/username/${answer.ans_by}`)
        try {
            console.log("answer id: ", answer._id);
            const response = await axios.post(`http://localhost:8000/post/questions/${answer._id}/upvoteanswer`, {
                userId: answerUser.data._id,
            });

            if (response.status === 200) {
                setVoteCount(voteCount + 1);
                // alert('Answer upvoted successfully!');
                // Optionally update local state to reflect the vote
            }
        } catch (error) {
            console.error('Error upvoting the answer:', error.response?.data?.message || error.message);
            alert('Failed to downvote the answer.');
        }
    };

    const handleDownVote = async () => {
        if (user.reputation < 50) {
            alert("You need a reputation of 50 or more to vote.");
            console.log('reputation: ', user.reputation);
            return;
        }
        const answerUser = await axios.get(`http://localhost:8000/post/users/username/${answer.ans_by}`)
        try {
            const response = await axios.post(`http://localhost:8000/post/questions/${answer._id}/downvoteanswer`, {
                userId: answerUser.data._id,
            });

            if (response.status === 200) {
                setVoteCount(voteCount - 1);
                // alert('Answer downvote successfully!');
                // Optionally update local state to reflect the vote
            }
        } catch (error) {
            console.error('Error upvoting the answer:', error.response?.data?.message || error.message);
            alert('Failed to upvote the answer.');
        }
    };


    return (
        <div className='question-view-answer'>
            <span className="answer-text">{formattedText}</span>
            <div className="question-answered-by">
                <div className="answerer">{answer.ans_by}</div>
                <div className="answerer-date-and-time">{`answered ${formatDate(new Date(answer.ans_date_time))}`}</div>
                <span style={{ color: 'blue' }}>{voteCount} votes</span>
                {isRegistered && currentView != 'profile' && <div className='vote-button-container'>
                    <button onClick={handleUpVote} className='btn vote-buttons'>Up Vote</button>
                    <button onClick={handleDownVote} className='btn vote-buttons'>Down Vote</button>
                </div>}
            </div>
        </div>
    );
};

export default Answer;
