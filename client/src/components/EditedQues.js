import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditQuestion({ questionId, setCurrentView }) {
    const [questionData, setQuestionData] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        text: '',
        tags: '',
    });
    const [formErrors, setFormErrors] = useState({});

    async function getOrCreateTags(tagsArray) {
        // const tagsArray = tagString.split(/\s+/).filter(Boolean); // Filters out empty strings
        // console.log('Tags to process:', tagsArray);

        const tagIds = await Promise.all(tagsArray.map(async (tagName) => {
            try {
                const oldTag = await axios.get(`http://localhost:8000/post/tags/name/${tagName}`);
                if (!oldTag.data || oldTag.data.length === 0) {
                    const newTag = await axios.post('http://localhost:8000/post/tags', {
                        name: tagName,
                    });
                    return newTag.data._id;
                }
                return oldTag.data._id;
            } catch (error) {
                console.error(`Error processing tag: ${tagName}`, error);
                throw error;
            }
        }));

        return tagIds;
    }
    // Fetch question data by ID
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/post/questions/${questionId}`);
                const question = response.data;

                const tagNames = question.tags.map(tag => tag.name).join(' ');

                setQuestionData(question);

                setFormData({
                    title: question.title,
                    summary: question.summary,
                    text: question.text,
                    tags: tagNames, // Convert array of tag names to a space-separated string
                });
            } catch (error) {
                console.error("Error fetching question:", error);
            }
        };

        fetchQuestion();
    }, [questionId]);


    // Validate the form
    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (formData.title.trim() === '') {
            alert("Question text can't be empty");
            isValid = false;
        }

        if (formData.summary.trim() === '') {
            alert("Question text can't be empty");
            isValid = false;
        }

        if (formData.text.trim() === '') {
            alert("Question text can't be empty");
            isValid = false;
        }

        const tagArray = formData.tags.toLowerCase().split(' ');

        if (tagArray.length >= 5) {
            alert("Maximum of 5 tags");
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
            const tagsArray = formData.tags.toLowerCase().split(' ');
            console.log("Tag Print", tagsArray);
            const tagIds = await getOrCreateTags(tagsArray);

            const updateData = {
                title: formData.title,
                summary: formData.summary,
                text: formData.text,
                tags: tagIds,
            };
            console.log("THIS IS THE QUESTION ID", questionId)
            console.log("Update data:", updateData);

            try {

                const response = await axios.patch(`http://localhost:8000/post/questions/${questionId}`, updateData);
                if (response.status === 200) {
                    console.log("Question updated:", response.data);
                    setCurrentView('profile'); // Navigate to home view after updating
                }
            } catch (error) {
                console.error('Error updating question:', error);
                // Handle error
            }


        } catch (error) {
            console.error("Error updating question:", error);
        }
    };

    const handleDelete = async () => {
        const confirmDeletion = window.confirm("Are you sure you want to delete this question?");
        if (confirmDeletion) {
            try {
                await axios.delete(`http://localhost:8000/post/questions/${questionId}`);
                setCurrentView('questions'); // Navigate to home view after deletion
            } catch (error) {
                console.error("Error deleting question:", error);
            }
        }
    };

    return (
        <div className='ask-question-form-container'>
            <div className="questions">
                <h2>Edit Question</h2>

                <div className="questions">
                    <h3>Question Title*</h3>
                    <p className="additional-info">Limit to 50 Characters or less</p>
                    <input
                        type="text"
                        id="questionTitleInput"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter your question title here"
                    />
                    {formErrors.titleError && <span className="error-message">{formErrors.titleError}</span>}
                </div>

                <div className="questions">
                    <h3>Question Summary*</h3>
                    <p className="additional-info">Add a summary of your question, limited to 140 characters</p>
                    <textarea rows="5" cols="50"
                        id="questionSummaryInput"
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        placeholder="Enter your question summary here"
                    ></textarea>
                    {formErrors.summaryError && <span className="error-message">{formErrors.summaryError}</span>}
                </div>

                <div className="questions">
                    <h3>Question Text*</h3>
                    <p className="additional-info">Add details</p>
                    <textarea rows="10" cols="50"
                        id="questionTextInput"
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        placeholder="Enter your question text here"
                    ></textarea>
                    {formErrors.textError && <span className="error-message">{formErrors.textError}</span>}
                </div>

                <div className="questions">
                    <h3>Tags*</h3>
                    <p className="additional-info">Add keywords separated by whitespace</p>
                    <input
                        type="text"
                        id="questionTagsInput"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="Enter tags for your question here"
                    />
                    {formErrors.tagsError && <span className="error-message">{formErrors.tagsError}</span>}
                </div>

                <div className="questions">
                    <button className="btn ask-question" onClick={handleSubmit}>
                        Update Question
                    </button>

                </div>
            </div>
        </div>
    );

}

export default EditQuestion;
