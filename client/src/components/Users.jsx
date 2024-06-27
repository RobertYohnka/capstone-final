import React, { useState, useEffect } from 'react';
import '../styles/styles.css';

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users from the backend
        fetch('/api/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    return (
        <section className="users">
            <h2>Users</h2>
            <div className="user-list">
                {users.map(user => (
                    <div key={user.id} className="user-card">
                        <h3>{user.userName}</h3>
                        <p>Email: {user.email}</p>
                        <p>Job Title: {user.jobTitle}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Users;
