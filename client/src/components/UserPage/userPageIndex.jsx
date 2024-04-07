import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import { Link as RouterLink } from 'react-router-dom';
import App from "../../App";

function UserPage() {
  const navigate = useNavigate();

  // Example navigation functions (adjust these with actual logic)
  const goToVotingPage = () => navigate('/vote');
  const getWhitelisted = () => console.log('Getting whitelisted...');
  const getNFTsForVoting = () => console.log('Getting NFTs for anonymous voting...');

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
          Welcome!
        </Typography>
        <Button variant="contained" onClick={goToVotingPage}>Go to voting page</Button>
        <Button variant="contained" onClick={getWhitelisted}>Get whitelisted</Button>
        <Button variant="contained" onClick={getNFTsForVoting}>Get NFTs for anonymous voting</Button>
      </Box>
    </Container>
  );
}

export default UserPage;
