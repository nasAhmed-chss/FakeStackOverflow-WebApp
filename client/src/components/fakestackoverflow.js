import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios

import Header from './header';
import Sidebar from './sidebar';
import MainContent from './maincontent';
import QuestionSection from './questionSection';
import AskQuestionForm from './askQuestion';
import TagPageParent from './tagPageParent';
import AnswerPage from './askAnswer.js';
import { sortQuestionsNewest, sortQuestionsActive, filterQuestionsUnanswered } from './questionSortings.js';
import StartPage from './startPage.js';
import UserProfile from './userProfile.js';
import Admin from './Admin.js';

import EditQuestion from './EditedQues';

import EditAnswer from './EditAnswer.js';

function FakeStackOverflow() {

  const [currentView, setCurrentView] = useState('questions'); // 'questions' or 'tags'
  const [showQuestionSection, setShowQuestionSection] = useState(true); // show questions
  const [showAskQuestionForm, setShowAskQuestionForm] = useState(false); // ask question
  const [selectedQuestion, setSelectedQuestion] = useState(null); // to display selected question
  const [showAnswerPageForm, setAnswerPage] = useState(false) // for answer page
  const [questionsPassed, setquestionsPassed] = useState([]) // for answer page
  const [headertext, setheadertext] = useState('All Questions') // for answer page
  const [numberOfQuestions, setnumberOfQuestions] = useState(0) // for answer page
  const [showquestionId, setQuestionId] = useState(null);

  // user related fields
  const [isAuthenticated, setIsAuthenticated] = useState(false); // to check if the session is authenticated
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [userForProfile, setUserForProfile] = useState('');


  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/post/questions');
      //console.log(response.data);
      const sortedQuestions = sortQuestionsNewest(response.data);
      setquestionsPassed(sortedQuestions); // Setting the fetched questions to the state variable
      setnumberOfQuestions(sortedQuestions.length);
      //console.log("THis is the selected q: ", selectedQuestion);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };


  const search = async (searchText) => {
    try {
      const response = await axios.get(`http://localhost:8000/post/questions`);
      console.log("Search Text: ", searchText);
      console.log(response.data);

      // Initialize arrays to store tag-based and non-tag-based search results
      let tagResults = [];
      let nonTagResults = [];

      // Split the search text into individual terms
      const searchTerms = searchText.split(/\s+/).map(term => term.trim());

      // Loop through each search term
      searchTerms.forEach(term => {
        // Check if the term is surrounded by brackets
        if (term.startsWith('[') && term.endsWith(']')) {
          // Extract the tag name by removing the brackets
          const tagName = term.substring(1, term.length - 1);
          // Filter questions based on tag name
          const tagQuestions = response.data.filter(question =>
            question.tags.some(tag => tag.name.toLowerCase() === tagName.toLowerCase())
          );
          // Add the tag-based search results to the array
          tagResults = tagResults.concat(tagQuestions);
        } else {
          // Treat the term as a non-tag word and search for questions with that word in their title or text
          const nonTagQuestions = response.data.filter(question =>
            question.title.toLowerCase().includes(term.toLowerCase()) ||
            question.text.toLowerCase().includes(term.toLowerCase())
          );
          // Add the non-tag-based search results to the array
          nonTagResults = nonTagResults.concat(nonTagQuestions);
        }
      });

      // Combine the tag-based and non-tag-based search results
      const combinedResults = [...new Set([...tagResults, ...nonTagResults])];

      // Update state with the combined search results
      setquestionsPassed(combinedResults);
      setShowQuestionSection(true);
      setCurrentView('search');

      // Set header text based on the presence of search results
      setheadertext(combinedResults.length === 0 ? "No Questions Found" : "Search Results");

      // Update the number of questions found
      setnumberOfQuestions(combinedResults.length);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleLogin = (user) => {
    setUser(user);
    setIsAuthenticated(true);
    setIsRegistered(true);
    setIsAdmin(user.isAdmin);
    setUsername(user.username);
    setName(user.firstName.concat(" ", user.lastName));
    setUserForProfile(user);
    console.log("this is the logged in user: ", user);
  };

  const handleRegister = () => {
    // setJustRegistered(true); 
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsRegistered(false);
    setIsAdmin(false);
    setUser(null);
    setUsername('');
    setName('');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const changeQuestionSection = (visibility) => {
    setShowQuestionSection(visibility);
  }

  const clearHomePage = () => {
    setShowQuestionSection(false);
    setAnswerPage(false);
    setCurrentView(null);
    setSelectedQuestion(null);
    setShowAskQuestionForm(false);
    setquestionsPassed([]);
  }

  const clearRest = () => {
    setShowAskQuestionForm(false);
    setAnswerPage(false);
    setShowQuestionSection(false);
    setSelectedQuestion(null);
  }

  const handleAskQuestion = () => {
    setShowQuestionSection(false);
    setShowAskQuestionForm(true); // Show the AskQuestionForm
    setCurrentView(null);
  };

  const handleAnswerQuestion = (questionId) => {
    setQuestionId(questionId);
    setShowQuestionSection(false);
    setAnswerPage(true); // Show the AnswerPageForm
    setCurrentView(null);
    setSelectedQuestion(null); // Set the selected question ID
  };

  const handleSelectTag = async (tagId) => {
    try {
      //console.log("tag id", tagId);
      const response = await axios.get(`http://localhost:8000/post/questions`);
      const tagRes = await axios.get(`http://localhost:8000/post/tags/${tagId}`);
      const tagName = tagRes.data.name;
      const filteredQuestions = response.data.filter(q => q.tags.some(t => t._id === tagId))
      //console.log("getting questions with specific tags:", filteredQuestions);
      clearHomePage();
      clearRest();
      setquestionsPassed(filteredQuestions);
      setCurrentView('questions');
      setheadertext("Questioned Tagged With " + tagName);
      setnumberOfQuestions(filteredQuestions.length);
      setShowQuestionSection(true);
    } catch (error) {
      console.error('Error selecting tag:', error);
    }
  };

  const handleQuestions = () => {
    fetchQuestions();
    clearHomePage();
    clearRest();
    setCurrentView('null');
    setCurrentView('questions');
    setheadertext("All Questions");
    setnumberOfQuestions(questionsPassed.length);
    changeQuestionSection(true);
    document.getElementById("questionTab").style.backgroundColor = "rgb(182, 175, 175)";
    document.getElementById("tagTab").style.backgroundColor = "#e1e1e1";
    document.getElementById("profileTab").style.backgroundColor = "#e1e1e1";
  }

  const handleNewestClick = async () => {
    try {
      const response = await axios.get('http://localhost:8000/post/questions');
      console.log(response.data)
      const sortedQuestions = sortQuestionsNewest(response.data);
      console.log("These are the sorted qs", sortedQuestions);
      clearHomePage();
      clearRest();
      setquestionsPassed(sortedQuestions);
      setCurrentView('questions');
      setheadertext("Newest Questions");
      setnumberOfQuestions(sortedQuestions.length);
      setShowQuestionSection(true);
    } catch (error) {
      console.error('Error fetching newest questions:', error);
    }
  };

  const handleActiveClick = async () => {
    try {
      const response = await axios.get('http://localhost:8000/post/questions');
      console.log(response.data);
      const sortedQuestions = sortQuestionsActive(response.data);
      clearHomePage();
      clearRest();
      setquestionsPassed(sortedQuestions);
      setCurrentView('questions');
      setheadertext("Active Questions");
      setnumberOfQuestions(sortedQuestions.length);
      setShowQuestionSection(true);
    } catch (error) {
      console.error('Error fetching active questions:', error);
    }
  };

  const handleUnansweredClick = async () => {
    try {
      const response = await axios.get('http://localhost:8000/post/questions');
      console.log(response.data);
      const filteredQuestions = filterQuestionsUnanswered(response.data);
      clearHomePage();
      clearRest();
      setquestionsPassed(filteredQuestions);
      setCurrentView('questions');
      setheadertext("Unanswered Questions");
      setnumberOfQuestions(filteredQuestions.length);
      setShowQuestionSection(true);
    } catch (error) {
      console.error('Error fetching unanswered questions:', error);
    }
  };

  const testHandle = () => {
    setShowQuestionSection(false);
    setAnswerPage(false)
    setCurrentView(null);
    setSelectedQuestion(null);
    setShowAskQuestionForm(false);
    setquestionsPassed([]);
    setShowQuestionSection(true);
    setCurrentView("questions");
  }

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    changeQuestionSection(false);
    setCurrentView('questions');
  };


  const onNavigateToUser = (user) => {
    setUserForProfile(user);
    setCurrentView('profileFromAdmin');
  }


  const handleEditQuestion = (questionId) => {
    setSelectedQuestion(questionId);
    changeQuestionSection(false);

    setCurrentView('editQuestion'); // Change view to edit question
    console.log("Edit is reachd")
  };


  const handleEditAnswer = (answerId) => {
    setSelectedQuestion(answerId);
    changeQuestionSection(false);

    setCurrentView('editAnswer'); // Change view to edit question
    console.log("Edit is reachd")
  };

  return (
    <div>
      <Header
        onSearch={search}
        handleQuestions={handleQuestions}
        handleLogout={handleLogout}
        isRegistered={isRegistered}
        isAuthenticated={isAuthenticated}
      />

      {!isAuthenticated && <StartPage
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        setIsRegistered={setIsRegistered}
        setIsAuthenticated={setIsAuthenticated}
      />}
      {isAuthenticated && <div className="main-container">
        <Sidebar
          onViewChange={handleViewChange}
          clearRest={clearRest}
          changeQuestionSection={changeQuestionSection}
          clearHomePage={clearHomePage}
          setSelectedQuestion={setSelectedQuestion}
          setquestionsPassed={setquestionsPassed}
          setnumberOfQuestions={setnumberOfQuestions}
          setheadertext={setheadertext}
          handleQuestions={handleQuestions}
          isRegistered={isRegistered}
        />
        <section className='questions-section' id='main-content'>
          {showQuestionSection && (
            <QuestionSection
              handleAskQuestion={handleAskQuestion}
              handleAnswerQuestion={handleAnswerQuestion}
              showAnswerPageForm={showAnswerPageForm}
              showAskQuestionForm={showAskQuestionForm}
              headertext={headertext}
              numberOfQuestions={numberOfQuestions}
              handleNewestClick={handleNewestClick}
              handleActiveClick={handleActiveClick}
              handleUnansweredClick={handleUnansweredClick}
              testHandle={testHandle}
              isRegistered={isRegistered}
            />
          )}

          {showAskQuestionForm && <AskQuestionForm
            user={userForProfile}
            setCurrentView={setCurrentView}
            changeQuestionSection={changeQuestionSection}
            setShowAskQuestionForm={setShowAskQuestionForm}
            handleQuestions={handleQuestions}
            username={username}
          />}

          {showAnswerPageForm && <AnswerPage questionId={showquestionId} handleQuestions={handleQuestions} username={username} />}


          {currentView === 'questions' && (
            <MainContent
              questionsPassed={questionsPassed}
              changeQuestionSection={changeQuestionSection}
              handleAskQuestion={handleAskQuestion}
              handleAnswerQuestion={handleAnswerQuestion}
              selectedQuestion={selectedQuestion}
              setSelectedQuestion={setSelectedQuestion}
              isRegistered={isRegistered}
              user={user}
              handleSelectQuestion={handleSelectQuestion}
              currentView={currentView}
            />
          )}
          {currentView === 'tags' &&
            <TagPageParent
              handleAskQuestion={handleAskQuestion}
              handleSelectTag={handleSelectTag}
              isRegistered={isRegistered}
            />
          }

          {currentView === 'search' &&
            <MainContent
              questionsPassed={questionsPassed}
              changeQuestionSection={changeQuestionSection}
              handleAskQuestion={handleAskQuestion}
              handleAnswerQuestion={handleAnswerQuestion}
              selectedQuestion={selectedQuestion}
              setSelectedQuestion={setSelectedQuestion}

            />}
          {currentView === 'profile' && !isAdmin &&
            <UserProfile
              user={userForProfile}
              handleSelectQuestion={handleSelectQuestion}
              isRegistered={isRegistered}
              setCurrentView={setCurrentView}
              handleSelectTag={handleSelectTag}
              handleEditQuestion={handleEditQuestion}
              handleEditAnswer={handleEditAnswer}
              currentView={currentView}
            />
          }
          {currentView === 'profileFromAdmin' && isAdmin &&
            <UserProfile
              user={userForProfile}
              handleSelectQuestion={handleSelectQuestion}
              isRegistered={isRegistered}
              setCurrentView={setCurrentView}
              handleSelectTag={handleSelectTag}
              handleEditQuestion={handleEditQuestion}
              handleEditAnswer={handleEditAnswer}
              currentView={currentView}
            />
          }

          {currentView === 'profile' && isAdmin &&
            <Admin
              user={user}
              onNavigateToUser={onNavigateToUser}
            />
          }
          {currentView === 'editQuestion' && (
            <EditQuestion
              questionId={selectedQuestion} // Pass the selected question ID
              setCurrentView={setCurrentView} // Pass the function to change the view
            />
          )}

          {currentView === 'editAnswer' && (
            <EditAnswer
              answerId={selectedQuestion} // Pass the selected question ID
              setCurrentView={setCurrentView} // Pass the function to change the view
            />
          )}


        </section>

      </div>}
    </div >
  );
}
export default FakeStackOverflow;
