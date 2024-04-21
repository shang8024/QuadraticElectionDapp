// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState({});
    const socket = io('http://localhost:4000', {
        withCredentials: true,
        transportOptions: {
            polling: {
                extraHeaders: {
                    'my-custom-header': 'abcd'
                }
            }
        }
    });

    useEffect(() => {
        // Request current users from server
        
        socket.on('updateUsers', updatedUsers => {
            setUsers(updatedUsers);
        });

        socket.emit('requestAllUsers');

        return () => {
            socket.off('updateUsers');
        };
    }, []);

    const addUser = (username, password) => {
        // Emit to server and let it handle the update
        socket.emit('addUser', { username, password });
    };

    const loginUser = (username, password) => {
        return new Promise((resolve, reject) => {
            socket.emit('requestAllUsers');  // Request the latest user data
    
            const handleUpdate = updatedUsers => {
                const userExists = updatedUsers[username] && updatedUsers[username].password === password;
                socket.off('updateUsers', handleUpdate);  // Remove listener to prevent memory leak
                resolve(userExists);
            };
    
            socket.on('updateUsers', handleUpdate);
        });
    };
    

    // Provide any additional user-related functionality here

    return (
        <UserContext.Provider value={{ users, addUser, loginUser }}>
            {children}
        </UserContext.Provider>
    );
};
