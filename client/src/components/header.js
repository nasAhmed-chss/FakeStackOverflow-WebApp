import React, { useState } from 'react';
import axios from 'axios';

function Header({ onSearch, handleQuestions, handleLogout, isRegistered, isAuthenticated }) {
    const [searchText, setSearchText] = useState('');

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchText(value);

        // Check if search bar is empty after each change
        if (value.trim() === '') {
            handleQuestions();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (searchText.trim() !== '') {
                // Perform search only if search bar is not empty
                onSearch(searchText);
            }
        }
    };

    const handleLogoutFully = () => {
        handleLogout();
        // have to add code to delete cookies
    };

    return (
        <header className="header">
            <h1 className="site-title" id="main-heading">Fake Stack Overflow</h1>
            <input
                type="search"
                id="search-bar"
                className="search-bar"
                placeholder="Search..."
                value={searchText}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
            />
            {isRegistered && <button className='btn logout-button' onClick={handleLogoutFully}>Log out</button>}
            {!isRegistered && isAuthenticated && <button className='btn logout-button' onClick={handleLogoutFully}>Log In / Sign Up</button>}
        </header>
    );
}

export default Header;
