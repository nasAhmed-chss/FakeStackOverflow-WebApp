import React, { useState, useEffect } from 'react';
import Answer from './answer';
import formatDate from './formdate';
import TagList from './taglist';
import axios from 'axios';
import AnswerComments from './answerComments';
import AnswerMixComments from './answerMixComments';


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

const QuestionDetail = ({ question, handleAskQuestion, handleAnswerQuestion, tags, isRegistered, user, currentView }) => {
    const [answers, setAnswers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [voteCount, setVoteCount] = useState(question.votes);
    const [render, setRender] = useState(0);
    const [coms, setComs] = useState([]);



    const answersPerPage = 5;
    const commentsPerAns = 3;
    const [questionComment, setQuestionComment] = useState('');
    const [commentError, setCommentError] = useState('');
    const [answerComments, setAnswerComments] = useState({});
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [currentComPage, setCurrentComPage] = useState(0);

    const [questionComments, setQuestionComments] = useState([]);
    const [answerCommentsMap, setAnswerCommentsMap] = useState({});



    useEffect(() => {
        // Fetch answers data from the server using Axios
        const fetchAnswers = async () => {
            try {
                //await axios.patch(`http://localhost:8000/post/questions/${question._id}/view-added`);
                const response = await axios.get(`http://localhost:8000/post/questions/${question._id}`);
                setAnswers(response.data.answers);
                //console.log(response.data.answers);
            } catch (error) {
                console.error('Error fetching answers:', error);
            }
        };
        fetchAnswers();
        const viewUpdate = async () => {
            await axios.patch(`http://localhost:8000/post/questions/${question._id}/view-added`);
        }
        viewUpdate();
        question.views += 1;
        //console.log("views updated to:", question.views);
    }, [question, question.votes]);

    useEffect(() => {
        fetchQuestionComments(question._id);
        fetchAnswerComments(answers);
    }, [question, answers]);

    // Function to modify question text to include hyperlinks
    const modifyQuestionText = (text) => {
        if (!text) return ''; // Check if text is defined
        // Define the regular expression pattern to match () followed by []
        const pattern = /\[(.*?)\]\s*\((https?:\/\/.*?)\)/g;

        // Replace matches with hyperlink format
        const modifiedText = text.replace(pattern, (match, textInParentheses, linkInBrackets) => {
            return `<a href="${linkInBrackets}" target="_blank">${textInParentheses}</a>`;
        });

        return modifiedText;
    };

    // Modify the question text to include hyperlinks
    const modifiedQuestionText = modifyQuestionText(question.text);


    // Function to handle adding a comment to a question
    const handleAddQuestionComment = async () => {
        if (!questionComment.trim()) {
            setCommentError('Comment cannot be empty.');
            return;
        }

        if (questionComment.length > 140) {
            setCommentError('Comment must be 140 characters or less.');
            return;
        }
        if (user.reputation < 50) {
            setCommentError('Must have reputation of over 50');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/post/comments`,
                { text: questionComment, commented_by: user.username } // replace 'user123' with the actual username
            );

            const newComment = response.data;

            // Link the comment to the question
            await axios.post(
                `http://localhost:8000/post/questions/${question._id}/link-comment`,
                { commentId: newComment._id }
            );

            // Update questionComments to include the new comment
            setQuestionComments((prevComments) => [...prevComments, newComment]);

            setQuestionComment(''); // Reset the input
            setCommentError('');
        } catch (error) {
            console.error('Error adding comment to question:', error);
            setCommentError('Failed to add comment. Please try again.');
        }
    };


    const handleAddAnswerComment = async (answerIdcoms, answerId) => {
        const commentText = answerIdcoms; // Ensure you have the right text
        setRender(render => render + 1);
        if (!commentText.trim()) {
            setCommentError('Comment cannot be empty.');
            return;
        }

        if (commentText.length > 140) {
            setCommentError('Comment must be 140 characters or less.');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/post/comments`,
                { text: commentText, commented_by: user.username } // Ensure user context is correct
            );

            const newComment = response.data;

            // Link the comment to the correct answer
            await axios.post(
                `http://localhost:8000/post/answers/${answerId}/link-comment`,
                { commentId: newComment._id }
            );

            // Ensure the state update logic is correct
            setAnswerCommentsMap((prevMap) => {
                // Check if there's already a list of comments for this answer
                const existingComments = prevMap[answerId] || [];
                return {
                    ...prevMap,
                    [answerId]: [...existingComments, newComment], // Append the new comment
                };
            });

            // Clear the comment text after posting
            setAnswerComments((prevState) => ({
                ...prevState,
                [answerId]: '', // Reset the text for this specific answer
            }));

            setCommentError(''); // Clear error messages
            setRefreshFlag((prev) => !prev); // Toggle the refresh flag to force a re-render
            return newComment;
        } catch (error) {
            console.error('Error adding comment to answer:', error);
            setCommentError('Failed to add comment. Please try again.');
        }
    };



    const sortedAnswers = answers
        .sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));


    const indexOfLastAnswer = currentPage * answersPerPage + answersPerPage;
    const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
    const currentAnswers = answers.slice(indexOfFirstAnswer, indexOfLastAnswer);

    const next = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const prev = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const handleUpVote = async () => {
        if (user.reputation < 50) {
            alert("You need a reputation of 50 or more to vote.");
            console.log('reputation: ', user.reputation);
            return;
        }

        const questionUser = await axios.get(`http://localhost:8000/post/users/username/${question.asked_by}`)
        try {
            const response = await axios.post(`http://localhost:8000/post/questions/${question._id}/upvote`, {
                userId: questionUser.data._id,
            });

            if (response.status === 200) {
                setVoteCount(voteCount + 1);
                // alert('Question upvoted successfully!');
                // Optionally update local state to reflect the vote
            }
        } catch (error) {
            console.error('Error upvoting the question:', error.response?.data?.message || error.message);
            alert('Failed to upvote the question.');
        }
    };

    const handleDownVote = async () => {
        if (user.reputation < 50) {
            alert("You need a reputation of 50 or more to vote.");
            console.log('reputation: ', user.reputation);
            return;
        }

        const questionUser = await axios.get(`http://localhost:8000/post/users/username/${question.asked_by}`)
        try {
            const response = await axios.post(`http://localhost:8000/post/questions/${question._id}/downvote`, {
                userId: questionUser.data._id,
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


    // Function to fetch comments for the question
    const fetchQuestionComments = async (questionId) => {
        try {
            const response = await axios.get(`http://localhost:8000/post/questions/${questionId}`);
            if (response.data.comments) {
                const commentResponses = await Promise.all(
                    response.data.comments.map(async (commentId) => {
                        const commentResponse = await axios.get(`http://localhost:8000/post/comments/${commentId}`);
                        return commentResponse.data;
                    })
                );

                setQuestionComments(commentResponses);
            }
        } catch (error) {
            console.error('Error fetching question comments:', error);
        }
    };

    // Function to fetch comments for all answers in the question
    const fetchAnswerComments = async (answers) => {
        try {
            const answerComments = {};
            for (const answer of answers) {
                if (answer.comments) {
                    const commentResponses = await Promise.all(
                        answer.comments.map((commentId) =>
                            axios.get(`http://localhost:8000/post/comments/${commentId}`)
                        )
                    );
                    answerComments[answer._id] = commentResponses.map((res) => res.data);
                }
            }
            setAnswerCommentsMap(answerComments);
            console.log('ans commetns: ', answerComments);
        } catch (error) {
            console.error('Error fetching answer comments:', error);
        }
    };

    useEffect(() => {
        fetchQuestionComments(question._id);
        fetchAnswerComments(answers);
    }, [question, answers]);


    const indexofLastComments = (currentComPage + 1) * commentsPerAns;
    const indexOfFirstComment = indexofLastComments - commentsPerAns;
    const currentComments = questionComments.slice(indexOfFirstComment, indexofLastComments);

    // change page
    const comPageChange = (pageNumber) => setCurrentComPage(pageNumber);

    return (
        <div className='question-details'>
            <div className='answer-and-title'>
                <div className='ans-and-views'>
                    <span >{answers.length} answers</span>
                    <span >{question.views} views</span>
                </div>
                <h3 className='question-view-title'>{question.title}</h3>
                {isRegistered && <button id='ask-question' className='btn question-view-ask-question' onClick={handleAskQuestion}>Ask Question</button>}
            </div>
            <div className='views-and-text'>
                <div className='text-and-tags'>
                    <div style={{ marginBottom: '10px' }} className='question-text' dangerouslySetInnerHTML={{ __html: modifiedQuestionText }}></div>
                    <TagList tagIds={question.tags} tags={tags} />
                </div>
                <div className="mixer">
                    <div>
                        <span className="view-asked-by" style={{ color: 'red' }}>{question.asked_by}</span>
                        <span>{` asked ${formatDate(new Date(question.ask_date_time))}`}</span>
                    </div>
                    <span id='vote-count' style={{ color: 'blue' }}>{voteCount} votes</span>
                    {isRegistered && <div className='vote-button-container'>
                        <button onClick={handleUpVote} className='btn vote-buttons'>Up Vote</button>
                        <button onClick={handleDownVote} className='btn vote-buttons'>Down vote</button>
                    </div>}
                </div>
            </div>
            <div className='comment'><h4>Comments</h4></div>
            {currentComments.map((comment) => (
                <AnswerComments comment={comment} isRegistered={isRegistered} user={user} render={render} />
            ))}
            <div className="page-btns">
                <button onClick={() => comPageChange(currentComPage - 1)} disabled={currentComPage === 0}>Prev</button>
                <button onClick={() => comPageChange(currentComPage + 1)} disabled={indexofLastComments >= questionComments.length}>Next</button>
            </div>
            <CommentInput
                value={questionComment}
                onChange={(e) => setQuestionComment(e.target.value)}
                onAddComment={handleAddQuestionComment}
                error={commentError}
            />
            <div>
                <h2>Answers</h2>
                {currentAnswers.map((answer) => (
                    <div key={answer._id} className='answer-container'>
                        <AnswerMixComments answer={answer} isRegistered={isRegistered}
                            user={user} handleAddAnswerComment={handleAddAnswerComment} commentError={commentError}
                            currentView={currentView} />

                        {/* <CommentInput
                            value={answerComments[answer._id]}
                            onChange={(e) => {
                                setAnswerComments((prevState) => ({
                                    ...prevState,
                                    [answer._id]: e.target.value,
                                }));
                                setRender(render => render + 1);
                            }}
                            onAddComment={() => handleAddAnswerComment(answer._id)}
                            error={commentError}
                        /> */}
                    </div>
                ))}

            </div>
            <div className="page-btns">
                <button onClick={prev} disabled={currentPage === 0}>Prev</button>
                <button onClick={next} disabled={indexOfLastAnswer >= answers.length}>Next</button>
            </div>

            {isRegistered && <button id="answer-question" className='btn answer-question' onClick={() => handleAnswerQuestion(question._id)}>Answer Question</button>}
        </div>
    );
};

export default QuestionDetail;

