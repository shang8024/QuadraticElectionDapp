import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation

function UserPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUser');
  // State variables to track if the user has requested whitelisting or NFTs
  const [requestedWhitelisting, setRequestedWhitelisting] = useState(false);
  const [requestedNFT, setRequestedNFT] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');

  useEffect(() => {
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
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);


  const updateAdminLists = (listName) => {
    const list = JSON.parse(localStorage.getItem(listName) || '[]');
    if (!list.includes(username)) {
      list.push(username);
      localStorage.setItem(listName, JSON.stringify(list));
    }
  };

  const getWhitelisted = () => {
    updateAdminLists('whitelistedUsers');
    setRequestedWhitelisting(true); // Update state to reflect request made
    console.log('Requesting to get whitelisted...');
  };

  const getNFTsForVoting = () => {
    updateAdminLists('anonymousVoters');
    setRequestedNFT(true); // Update state to reflect request made
    console.log('Requesting NFTs for anonymous voting...');
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
          gap: 2, // Add space between buttons
        }}
      >
        <Typography component="h1" variant="h5">
          Welcome, {username}!
        </Typography>
        <Button variant="contained" onClick={goToVotingPage}>Go to voting page</Button>
        <Button 
          variant="contained" 
          onClick={getWhitelisted}
          disabled={requestedWhitelisting} // Disable button after request
        >
          {requestedWhitelisting ? 'Requested for whitelisting' : 'Get whitelisted'}
        </Button>
        <Button 
          variant="contained" 
          onClick={getNFTsForVoting}
          disabled={requestedNFT} // Disable button after request
        >
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
