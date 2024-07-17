import React, { useState } from 'react';
import Login from './loginPage';
import Register from './registerPage';
import '../stylesheets/startPage.css';

function StartPage({ handleLogin, handleRegister, setIsRegistered, setIsAuthenticated }) {
  const [buttonChosen, setButtonChosen] = useState('');

  const handleGuestLogin = () => {
    setIsRegistered(false);
    setIsAuthenticated(true);
    setButtonChosen('');
  };


  return (
    <div className="start-page-main">
      {buttonChosen !== 'login' && buttonChosen !== 'register' && (
        <div className="start-page">
          <h2 className='start-heading'>Welcome to FakeStackOverflow!</h2>
          <button onClick={() => setButtonChosen('login')} className="btn start-buttons" id="login-button">
            Login
          </button>
          <button onClick={() => setButtonChosen('register')} className="btn start-buttons" id="register-button">
            Register
          </button>
          <button onClick={handleGuestLogin} className="btn start-buttons" id="guestlogin-button">
            Continue as Guest
          </button>
        </div>
      )}

      {buttonChosen === 'login' && <Login handleLogin={handleLogin} setButtonChosen={setButtonChosen} />}
      {buttonChosen === 'register' && <Register handleRegister={handleRegister} setButtonChosen={setButtonChosen} />}
    </div>
  );
}

export default StartPage;
