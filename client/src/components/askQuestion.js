import React, { useState } from 'react';
import axios from 'axios'; // Import Axios



function AskQuestionForm({ user, handleQuestions, username }) {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
    const [summary, setSummary] = useState('');
    //const [isQuestionPosted, setIsQuestionPosted] = useState(false);


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


    const handlePostQuestion = async () => {
        // Check constraints for each input field
        if (title.trim().length === 0 || title.trim().length > 50) {
            alert('Please enter a title with 1 to 50 characters.');
            return;
        }
        if (summary.trim().length === 0 || summary.trim().length > 140) {
            alert('Please enter a summary with 1 to 140 characters.');
            return;
        }

        if (text.trim().length === 0) {
            alert('Please enter the question text.');
            return;
        }

        if (tags.trim().length === 0) {
            alert('Please enter a valid tag.');
            return;
        }
        if (user.reputation < 50) {
            alert("You need a reputation of 50 or more to add a tag");
            console.log('reputation: ', user.reputation);
            return;
        }
        //console.log("this is the tags:", tags);

        const tagsArray = tags.toLowerCase().split(' ');
        if (tagsArray.length > 5) {
            alert('Please enter 1 to 5 tags separated by whitespace.');
            return;
        }

        for (let i = 0; i < tagsArray.length; i++) {
            if (tagsArray[i].length > 20) {
                alert('Each tag should be up to 20 characters long.');
                return;
            }
        }


        try {
            // Post question to the server

            // create tags if needed
            const tagIds = await getOrCreateTags(tagsArray);
            //console.log('username: ', username);

            const response = await axios.post('http://localhost:8000/post/questions', {
                title: title,
                text: text,
                summary: summary,
                tagIds: tagIds,
                asked_by: username,
            });


            // Reset form fields after posting question
            setTitle('');
            setText('');
            setTags('');
            setSummary('');
            //setIsQuestionPosted(true); // Set the flag to indicate that the question is posted
            handleQuestions(response.data);
        } catch (error) {
            console.error('Error posting question:', error);
            // alert('Error posting question. Please try again later.');
        }
    };

    return (
        <div className='ask-question-form-container'>
            {true && (
                <div className="questions">
                    <h2>Question Title*</h2>
                    <p className="additional-info">Limit to 50 Characters or less</p>
                    <input type="text" id="questionTitleInput" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your question title here" />

                    <div className="questions">
                        <h3>Question Summary*</h3>
                        <p className="additional-info">Add a summary of your qustion, limitted to 140 characters</p>
                        <input type="text" id="questionSummaryInput" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Enter your question summary here" />
                    </div>

                    <div className="questions">
                        <h3>Question Text*</h3>
                        <p className="additional-info">Add details</p>
                        <input type="text" id="questionTextInput" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your question text here" />
                    </div>

                    <div className="questions">
                        <h3>Tags*</h3>
                        <p className="additional-info">Add keywords separated by whitespace</p>
                        <input type="text" id="questionTagsInput" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Enter tags for your question here" />
                    </div>

                    <div className="questions">
                        <button className="btn ask-question" id="postQuestionButton" onClick={handlePostQuestion}>Post Question</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AskQuestionForm;
