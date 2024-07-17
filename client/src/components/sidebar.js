import React from 'react';


function Sidebar({ onViewChange, clearRest, changeQuestionSection,
    clearHomePage, setSelectedQuestion, setquestionsPassed,
    setnumberOfQuestions, setheadertext, handleQuestions, isRegistered }) {

    const handleTags = () => {
        clearHomePage();
        clearRest();
        onViewChange('tags');
        document.getElementById("tagTab").style.backgroundColor = "rgb(182, 175, 175)";
        document.getElementById("questionTab").style.backgroundColor = "#e1e1e1";
        document.getElementById("profileTab").style.backgroundColor = "#e1e1e1";
    }

    const handleProfile = () => {
        if (!isRegistered) {
            alert("Please Login To View Your Profile");
            return;
        }
        clearHomePage();
        clearRest();
        onViewChange('profile');
        document.getElementById("tagTab").style.backgroundColor = "#e1e1e1";
        document.getElementById("questionTab").style.backgroundColor = "#e1e1e1";
        document.getElementById("profileTab").style.backgroundColor = "rgb(182, 175, 175)";
    }

    return (
        <aside className="sidebar">
            <button id="questionTab" className="tabs" onClick={() => handleQuestions()}>Questions</button>
            <button id="tagTab" className="tabs" onClick={() => handleTags()}>Tags</button>
            <button id="profileTab" className="tabs" onClick={() => handleProfile()}>User Profile</button>
        </aside>
    );
}

export default Sidebar;
