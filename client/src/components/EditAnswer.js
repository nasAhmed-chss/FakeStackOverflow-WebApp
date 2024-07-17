import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditAnswer({ answerId, setCurrentView }) {
    const [answerData, setAnswerData] = useState(null);
    const [answerText, setAnswerText] = useState('');
    const [formErrors, setFormErrors] = useState({});
    console.log("THIS IS THE ANSWER ID", answerId)
    // Fetch answer data by ID
    useEffect(() => {
        const fetchAnswer = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/post/answers/${answerId}`);
                const answer = response.data;

                setAnswerData(answer);
                setAnswerText(answer.text); // Set the text to edit
            } catch (error) {
                console.error("Error fetching answer:", error);
            }
        };

        fetchAnswer();
    }, [answerId]);

    // Validate the form
    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (answerText.trim() === '') {
            errors.textError = 'Answer text cannot be empty';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const updateData = {
                text: answerText,
            };
            console.log("THIS IS THE QUESTION ID", answerId)
            console.log("Update data:", updateData);
            const response = await axios.patch(`http://localhost:8000/post/answers/${answerId}`, updateData);

            if (response.status === 200) {
                console.log("Answer updated:", response.data);
                setCurrentView('profile'); // Navigate to the profile view after updating
            }
        } catch (error) {
            console.error("Error updating answer:", error);
        }
    };



    return (
        <div className="ask-question-form-container">
            <div className="questions">
                <h2>Edit Answer</h2>

                <div className="questions">
                    <h3>Answer Text*</h3>
                    <p className="additional-info">Add details</p>
                    <textarea rows="10" cols="50"
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Edit your answer here"
                    />
                    {formErrors.textError && (
                        <span className="error-message">{formErrors.textError}</span>
                    )}
                </div>

                <div className="questions">
                    <button className="btn ask-question" onClick={handleSubmit}>
                        Update Answer
                    </button>

                </div>
            </div>
        </div>
    );
}

export default EditAnswer;
