import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TagsPage from './tagsPage';

const TagPageParent = ({ handleAskQuestion, handleSelectTag, isRegistered }) => {
    const [tags, setTags] = useState([]);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        // Fetch tags and questions data from the server using Axios
        const fetchData = async () => {
            try {
                const tagsResponse = await axios.get('http://localhost:8000/post/tags');
                setTags(tagsResponse.data);

                const questionsResponse = await axios.get('http://localhost:8000/post/questions');
                setQuestions(questionsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div id="tagspage">
            <TagsPage
                tags={tags}
                questions={questions}
                onSelectTag={handleSelectTag}
                onAskQuestion={handleAskQuestion}
                isRegistered={isRegistered}
            />
        </div>
    );
};

export default TagPageParent;
