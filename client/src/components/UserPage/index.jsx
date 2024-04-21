import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useUser } from '../../contexts/UserContext/UserContext.js';

// Assuming you have a WebSocket context or connection initialized elsewhere and imported here
// If not, you can directly initialize as shown:
const socket = io('http://localhost:4000');

function UserPage() {
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();
    const username = localStorage.getItem('currentUser'); // This can also be managed globally via Context API
    const [requestedWhitelisting, setRequestedWhitelisting] = useState(false);
    const [requestedNFT, setRequestedNFT] = useState(false);
    const [currentAccount, setCurrentAccount] = useState('');

    useEffect(() => {
        socket.emit('requestAllUsers');  // Request all users on component mount

        socket.on('updateUsers', (users) => {
            setAllUsers(Object.entries(users).map(([username, details]) => ({ username, ...details })));
        });
    
        socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                console.log("Please connect to MetaMask.");
            } else {
                setCurrentAccount(accounts[0]);
            }
        };

        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_accounts' })
                .then(handleAccountsChanged)
                .catch((err) => {
                    console.error(err);
                 });

            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
            };
        }, []);

    const updateAdminLists = (listName) => {
        socket.emit('updateList', { listName, username });
    };

    const requestFeature = (feature) => {
        socket.emit('updateList', { username, listName: feature });
        if (feature === 'whitelistedUsers') {
            setRequestedWhitelisting(true);
        } else if (feature === 'anonymousVoters') {
            setRequestedNFT(true);
            socket.emit('requestNFT', username ); 
            console.log(typeof(username));
        }
    };

    const goToVotingPage = () => navigate('/vote');

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Typography component="h1" variant="h5">
                    Welcome, {username}!
                </Typography>
                <Button variant="contained" onClick={goToVotingPage}>Go to voting page</Button>
                <Button variant="contained" onClick={() => requestFeature('whitelistedUsers')} disabled={requestedWhitelisting}>
                    {requestedWhitelisting ? 'Requested for whitelisting' : 'Get whitelisted'}
                </Button>
                <Button variant="contained" onClick={() => requestFeature('anonymousVoters')} disabled={requestedNFT}>
                    {requestedNFT ? 'Requested for NFT' : 'Get NFTs for anonymous voting'}
                </Button>
                <Box sx={{ p: 2, border: '1px dashed grey' }}>
                    <Typography variant="body1">
                        User Metamask Account: {currentAccount || 'Not Connected'}
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default UserPage;
