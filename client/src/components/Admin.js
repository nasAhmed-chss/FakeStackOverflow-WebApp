import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin({ user, onNavigateToUser }) {
    const [adminProfile, setAdminProfile] = useState(null);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        setAdminProfile(user);

        const fetchAllUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/post/users');
                setAllUsers(response.data);
            } catch (error) {
                console.error("Error fetching all users:", error);
            }
        };
        fetchAllUsers();
    }, [user]);
    console.log("admin prof: ", adminProfile);

    const handleUserDeletion = async (username) => {
        const confirmDeletion = window.confirm(`Do you want to delete the user: ${username}?`);
        if (confirmDeletion) {
            try {
                await axios.delete(`http://localhost:8000/post/users/${username}`);
                setAllUsers((prevUsers) => prevUsers.filter(user => user.username !== username));
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    // const getMembershipDuration = (joinedDate) => {
    //     const joined = new Date(joinedDate);
    //     const now = new Date();
    //     const years = now.getFullYear() - joined.getFullYear();
    //     const months = now.getMonth() - joined.getMonth();
    //     const days = now.getDate() - joined.getDate();

    //     return `${years} year(s), ${months} month(s), ${days} day(s)`;
    // };

    //const adminDuration = getMembershipDuration(adminProfile.joinedDate);
    const isOnlyAdmin = allUsers.length === 1 && allUsers[0].username === adminProfile.username;

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
        console.log("joindate: ", [yearsStr, monthsStr, daysStr, hoursStr].filter(Boolean).join(', '));
        return [yearsStr, monthsStr, daysStr, hoursStr].filter(Boolean).join(', ');
    };

    return (
        <div className='admin-dashboard'>
            <div className='admin-profile'>
                <h2>Admin Profile: {user.firstName} {user.lastName}</h2>
                <p>Username: {user.username}</p>
                <p>Reputation: {user.reputation}</p>
                <p>Membership Duration: {timeSinceJoining(user.joinedDate)}</p>
            </div>

            <div className='user-management'>
                <h2>All Users</h2>
                <div className='user-list'>
                    {isOnlyAdmin ? (
                        <div className='only-admin'>
                            <p>No other users in the system.</p>
                        </div>
                    ) : (
                        allUsers.map((user) => (
                            <div key={user._id} className='user-entry'>
                                <span onClick={() => onNavigateToUser(user)}>
                                    {user.username}
                                </span>
                                {user.username !== adminProfile.username && (
                                    <button onClick={() => handleUserDeletion(user.username)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;
