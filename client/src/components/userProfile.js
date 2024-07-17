import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './question';
import Answer from './answer';
import TagRow from './tagRow';

import { sortQuestionsNewest, sortQuestionsActive, filterQuestionsUnanswered } from './questionSortings.js';

const UserProfile = ({ user, handleSelectQuestion, isRegistered, setCurrentView, handleSelectTag, handleEditQuestion, handleEditAnswer, currentView }) => {
    const [profile, setProfile] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [tags, setTags] = useState([]);
    const [error, setError] = useState('');
    const [tagsFound, setTagsFound] = useState([]);
    const [render, setRender] = useState(false);
    const [allQuestions, setAllQuestions] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // const profileRes = await axios.get(`/api/users/${user.id}`);
                const questionsRes = await axios.get(`http://localhost:8000/post/questions/user/${user.username}`);
                console.log('questions:', questionsRes.data);
                const answersRes = await axios.get(`http://localhost:8000/post/answers/user/${user.username}`);
                console.log('answers:', answersRes.data);
                const tagsRes = await axios.get(`http://localhost:8000/post/tags/user/${user.username}`);
                console.log('tags:', tagsRes.data);
                const questionsResponse = await axios.get('http://localhost:8000/post/questions');
                setAllQuestions(questionsResponse.data);

                setProfile(user);
                const sortedQuestions = sortQuestionsNewest(questionsRes.data)
                setQuestions(sortedQuestions);
                setAnswers(answersRes.data);
                setTagsFound(tagsRes.data);
            } catch (err) {
                setError('Failed to fetch data');
            }
        };
        fetchData();
    }, [user.username, render]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const tagsResponse = await axios.get('http://localhost:8000/post/tags');
                setTags(tagsResponse.data); // Ensure the response data is an array
            } catch (error) {
                console.error("Error fetching tags:", error);
                setError("Failed to fetch tags. Please try again."); // Display error message
            }
        };
        fetchTags();
    }, [questions, render]);



    const timeSinceJoining = (date) => {
        const joiningDate = new Date(date);
        const now = new Date();

        // Calculate the difference in years
        let years = now.getFullYear() - joiningDate.getFullYear();
        if (now.getMonth() < joiningDate.getMonth() ||
            (now.getMonth() === joiningDate.getMonth() && now.getDate() < joiningDate.getDate())) {
            years--;
        }

        // Calculate the difference in months
        let months = now.getMonth() - joiningDate.getMonth() + (years * 12);
        if (now.getDate() < joiningDate.getDate()) {
            months--;
        }

        // Calculate the difference in days
        let days = now.getDate() - joiningDate.getDate();
        if (days < 0) {
            const daysInLastFullMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            days += daysInLastFullMonth;
        }

        // Calculate the difference in hours
        let hours = now.getHours() - joiningDate.getHours();
        if (hours < 0) {
            hours += 24;
            days--;
        }

        // Normalize the months and years based on the new days and months calculation
        if (months >= 12) {
            years += Math.floor(months / 12);
            months = months % 12;
        }

        // Normalize days in case we adjusted hours
        if (days < 0) {
            months--;
            days += new Date(now.getFullYear(), now.getMonth() - 1, 0).getDate(); // Get days in last month
        }

        // Format the output string
        const yearsStr = years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : '';
        const monthsStr = months > 0 ? `${months} ${months === 1 ? 'month' : 'months'}` : '';
        const daysStr = days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : '';
        const hoursStr = hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '';
        return [yearsStr, monthsStr, daysStr, hoursStr].filter(Boolean).join(', ');
    };


    if (error) {
        return <div>{error}</div>;
    }

    if (!profile) {
        return <div>Loading...</div>;
    }


    const groupedTags = tagsFound.reduce((group, tag, index) => {
        const groupIndex = Math.floor(index / 3);
        group[groupIndex] = [...(group[groupIndex] || []), tag];
        return group;
    }, []);

    const handleDeleteQuestion = async (questionId) => {
        // Confirm with the user before deletion
        const confirmation = window.confirm("Are you sure you want to delete this question?");
        if (!confirmation) return;

        try {
            // Send DELETE request to the server
            await axios.delete(`http://localhost:8000/post/questions/${questionId}`);

            // Update local state to remove the deleted question
            setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== questionId));
        } catch (error) {
            console.error("Failed to delete question:", error);
            setError("Failed to delete question. Please try again."); // Display error message
        }
    };

    const handleDeleteAnswer = async (answerId) => {
        // Confirm with the user before deletion
        const confirmation = window.confirm("Are you sure you want to delete this answer?");
        if (!confirmation) return; // Exit if the user does not confirm

        try {
            // Send DELETE request to the server to delete the answer
            await axios.delete(`http://localhost:8000/post/answers/${answerId}`);

            // Update local state to remove the deleted answer
            setAnswers((prevAnswers) => prevAnswers.filter((a) => a._id !== answerId));
        } catch (error) {
            console.error("Failed to delete answer:", error);
            setError("Failed to delete answer. Please try again."); // Display error message
        }
    };
    const handleDeleteTag = async (tagId, questionCount) => {
        if (questionCount > 1) {
            alert("You cannot delete this tag. Other users are using is.");
            return;
        }
        const confirmation = window.confirm("Are you sure you want to delete this tag?");
        if (!confirmation) return;

        try {
            console.log("Deleting tag with ID:", tagId);

            await axios.delete(`http://localhost:8000/post/tags/${tagId}`); // Delete tag from server

            // Refetch tags to ensure the UI reflects the latest data
            const tagsResponse = await axios.get('http://localhost:8000/post/tags');
            setTags(tagsResponse.data); // Set the updated list of tags in state
            setRender(!render);
            // setCurrentView('tags');
            alert("Tag Deletion Successful")
        } catch (error) {
            console.error("Failed to delete tag:", error);
            setError("Failed to delete tag. Please try again.");
        }
    };






    return (
        <div>
            <h2>User Profile: {profile.firstName} {profile.lastName}</h2>
            <p>Username: {profile.username}</p>
            <p>Reputation: {profile.reputation}</p>
            <p>Membership Duration: {timeSinceJoining(profile.joinedDate)}</p>
            <h2>Questions Asked</h2>
            {questions.length ? questions.map((question) => (
                <div>
                    <Question key={question._id} question={question} tags={tags} onSelect={handleSelectQuestion} />
                    <button className='btn' onClick={() => handleEditQuestion(question._id)}>Edit</button>
                    <button className='btn' onClick={() => handleDeleteQuestion(question._id)}>Delete</button>
                </div>
            )) : <p>No questions posted.</p>}
            <h2>Answers Posted</h2>
            {answers.length ? answers.map((answer) => (
                <div key={answer._id} className='answer-container'>
                    <Answer answer={answer} isRegistered={isRegistered} user={user} />
                    <button className='btn' onClick={() => handleEditAnswer(answer._id)}>Edit</button>
                    <button className='btn' onClick={() => handleDeleteAnswer(answer._id)}>Delete</button>
                </div >
            )) : <p>No answers posted.</p>}
            <h2>Tags</h2>
            {
                tagsFound.length ? groupedTags.map((group, index) => (
                    <div>
                        <TagRow key={index} tags={group} questions={allQuestions}
                            onSelectTag={handleSelectTag} currentView={currentView}
                            handleDeleteTag={handleDeleteTag} setRender={setRender} render={render} isRegistered={isRegistered} />
                    </div>
                )) : <p>No tags created.</p>
            }
        </div >
    );
};

export default UserProfile;
