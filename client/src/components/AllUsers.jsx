import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import { fetchUsers } from '../API/index';

function AllUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const userdata = await fetchUsers();
                setUsers(userdata);
                setFilteredUsers(userdata);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError(error.message);
            }
        };
        getUsers();
    }, []);

    const onInputChange = (event) => {
        const searchValue = event.target.value.toLowerCase();
        const filteredUsers = users.filter(user => user.username.toLowerCase().includes(searchValue));
        setFilteredUsers(filteredUsers);
    };

    return (
        <div>
            <h2>All Users</h2>
            {error && <p>Error: {error}</p>}
            <input onChange={onInputChange} placeholder="Search users..." />
            <div className="user-list">
                {filteredUsers.map(user => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
}

export default AllUsers;