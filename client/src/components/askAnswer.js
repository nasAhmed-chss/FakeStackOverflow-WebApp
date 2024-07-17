import React, { useState } from 'react';
import axios from 'axios'; // Import Axios


function AnswerPage({ questionId, handleQuestions, username }) {
    const [answerText, setAnswerText] = useState('');
    //const [isAnswerPosted, setAnswerPosted] = useState(false);

    const handlePostAnswer = async () => {
        // Check if the username and answer text are not empty

        try {
            // Post answer to the server
            console.log("This is the questionID", questionId);
            await axios.post(`http://localhost:8000/post/questions/${questionId}/answers`, {
                text: answerText,
                ans_by: username,
                ans_date_time: new Date()
            });

            // Optionally, you can clear the input fields after posting the answer
            setAnswerText('');

            // Optionally, you can display a success message
            //alert('Answer posted successfully!');

            //setAnswerPosted(true);
            handleQuestions();
        } catch (error) {
            handleQuestions();
            console.error('Error posting answer:', error);
            // Optionally, you can display an error message
            //alert('Error posting answer. Please try again later.');
        }
    };

    return (
        <div>
            <div className="questions-header"></div>
            <div className="content">
                <div className="questions">
                    <h3>Answer Text*</h3>
                    <p className="additional-info">Add details</p>
                    <input type="text" placeholder="Enter your answer here" value={answerText} onChange={(e) => setAnswerText(e.target.value)} />
                </div>
                <div className="questions">
                    <button className="btn ask-question" id="postAnswerButton" onClick={handlePostAnswer}>Post Answer</button>
                </div>
            </div>
        </div>
    );
}

export default AnswerPage;
