import React, { useState } from 'react';
import formatDate from './formdate';
import axios from 'axios';

const AnswerComments = ({ comment, isRegistered, user, render }) => {
    const [voteCount, setVoteCount] = useState(comment.votes);
    const handleUpVote = async () => {

        const commentUser = await axios.get(`http://localhost:8000/post/users/username/${comment.commented_by}`)
        try {
            const response = await axios.post(`http://localhost:8000/post/questions/${comment._id}/upvotecomment`, {
                userId: commentUser.data._id,
            });

            if (response.status === 200) {
                setVoteCount(voteCount + 1);
                //alert('Question upvoted successfully!');
                // Optionally update local state to reflect the vote
            }
        } catch (error) {
            console.error('Error upvoting the question:', error.response?.data?.message || error.message);
            alert('Failed to upvote the question.');
        }
    };

    const handleDownVote = async () => {

        const commentUser = await axios.get(`http://localhost:8000/post/users/username/${comment.commented_by}`)
        try {
            const response = await axios.post(`http://localhost:8000/post/questions/${comment._id}/downvotecomment`, {
                userId: commentUser.data._id,
            });

            if (response.status === 200) {
                setVoteCount(voteCount - 1);
                // alert('Question downvote successfully!');
                // Optionally update local state to reflect the vote
            }
        } catch (error) {
            console.error('Error upvoting the question:', error.response?.data?.message || error.message);
            alert('Failed to upvote the question.');
        }
    };

    return (
        <div className="comment">
            <p>{comment.text}</p>
            <div className="comment-metadata">
                <span>By: {comment.commented_by} </span>
                <span>At: {formatDate(new Date(comment.comment_date_time))} </span>
                <span>Votes: {voteCount}</span>
            </div>
            {isRegistered && <div className='vote-button-container'>
                <button onClick={handleUpVote} className='btn vote-buttons'>Up Vote</button>
                <button onClick={handleDownVote} className='btn vote-buttons'>Down vote</button>
            </div>}
        </div>
    );
};

export default AnswerComments;