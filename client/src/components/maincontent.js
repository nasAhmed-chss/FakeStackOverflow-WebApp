import React, { useState, useEffect } from 'react';
import QuestionList from './questionlist';
import axios from 'axios';
import QuestionDetail from './questionDetail.js';

function MainContent({ questionsPassed, changeQuestionSection, handleAskQuestion,
    handleAnswerQuestion, selectedQuestion, setSelectedQuestion,
    isRegistered, user, handleSelectQuestion, currentView }) {
    const [questions, setQuestions] = useState([]);
    const [tags, setTags] = useState([]);



    // useEffect(() => {
    //     // Fetch tags and questions data from the server using Axios
    //     const fetchData = async () => {
    //         try {
    //             const tagsResponse = await axios.get('http://localhost:8000/post/tags');
    //             setTags(tagsResponse.data);

    //             const questionsResponse = await axios.get('http://localhost:8000/post/questions');
    //             setQuestions(questionsResponse.data);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    useEffect(() => {
        setQuestions(questionsPassed);
        const tagsResponse = axios.get('http://localhost:8000/post/tags');
        setTags(tagsResponse);
    }, [questionsPassed]);
    return (
        <div>
            {
                !selectedQuestion
                    ? <QuestionList questions={questions} tags={tags} onSelect={handleSelectQuestion} />
                    : <QuestionDetail
                        question={selectedQuestion}
                        handleAskQuestion={handleAskQuestion}
                        handleAnswerQuestion={handleAnswerQuestion}
                        tags={tags}
                        isRegistered={isRegistered}
                        user={user}
                        currentView={currentView}
                    />
            }
        </div>
    );
}

export default MainContent;
