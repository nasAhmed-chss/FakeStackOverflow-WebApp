import React, { useEffect, useState } from 'react';
import Answer from './answer';
import AnswerComments from './answerComments';
import axios from 'axios';


// A reusable CommentInput component to handle adding comments
const CommentInput = ({ value, onChange, onAddComment, error }) => (
    <div className='comment'>
        <input
            type='text'
            placeholder='Add a comment...'
            value={value}
            onChange={onChange}
        />
        <button className='btn add-comment-btn' onClick={onAddComment}>
            Add Comment
        </button>
        {error && <p className='error-message'>{error}</p>}
    </div>
);


const AnswerMixComments = ({ answer, isRegistered, user, handleAddAnswerComment, commentError, currentView }) => {
    const [currentComPage, setCurrentComPage] = useState(0);
    const [coms, setComs] = useState([]);
    const [inputVal, setInpputVal] = useState('');
    //const [currentComments, setCurrentComments] = useState([]);

    const commentsPerAns = 3;

    const fetchAnswerComments = async (answer) => {
        try {
            // Map each commentId to a GET request promise
            const commentRequests = answer.comments.map((commentId) =>
                axios.get(`http://localhost:8000/post/comments/${commentId}`)
            );

            // Use Promise.all to wait for all requests to complete and collect the responses
            const responses = await Promise.all(commentRequests);

            // Extract data from each response
            const commentsData = responses.map(response => response.data);

            return commentsData;
        } catch (error) {
            console.error('Error fetching comments:', error);
            return []; // Return an empty array in case of an error
        }
    };

    const fetchAndDisplayComments = async (answer) => {
        const comments = await fetchAnswerComments(answer);
        setComs(comments);
        console.log("comments: ", comments);
    };

    useEffect(() => {
        fetchAndDisplayComments(answer);
        setCurrentComPage(0);
        //setCurrentComments(coms.slice(indexOfFirstComment, indexofLastComments));
    }, [answer.comments.length]);

    const indexofLastComments = (currentComPage + 1) * commentsPerAns;
    const indexOfFirstComment = indexofLastComments - commentsPerAns;
    const currentComments = coms.slice(indexOfFirstComment, indexofLastComments);

    // change page
    const comPageChange = (pageNumber) => setCurrentComPage(pageNumber);

    const middleHandler = async (coms) => {
        const tempComment = await handleAddAnswerComment(coms, answer._id);
        setComs((prevComments) => [...prevComments, tempComment]);
    }



    return (
        <>
            <Answer answer={answer} isRegistered={isRegistered} user={user} currentView={currentView} />
            <div className='comment'><h4>Comments</h4></div>
            {currentComments?.map((comment) => (
                <AnswerComments comment={comment} isRegistered={isRegistered} user={user} />
            ))}
            <div className="page-btns">
                <button onClick={() => comPageChange(currentComPage - 1)} disabled={currentComPage === 0}>Prev</button>
                <button onClick={() => comPageChange(currentComPage + 1)} disabled={indexofLastComments >= coms.length}>Next</button>
            </div>
            <CommentInput
                value={inputVal}
                onChange={(e) => {
                    setInpputVal(e.target.value);
                }}
                onAddComment={() => middleHandler(inputVal)}
                error={commentError}
            />
        </>
    );
};

export default AnswerMixComments;