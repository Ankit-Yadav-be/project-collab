import React from 'react';
import { useUser } from '../userContext/authContext'; // Adjust the path as needed

const Profile = () => {
    const { user } = useUser(); // Correctly destructuring the context value

    console.log(user); // Log the user data to check

    return (
        <div>
            <h1>Profile</h1>
            {user ? (
                <div>
                    <p>Email: {user.email}</p>
                    <button onClick={clearUser}>Logout</button>
                </div>
            ) : (
                <p>No user data available</p>
            )}
        </div>
    );
};

export default Profile;
