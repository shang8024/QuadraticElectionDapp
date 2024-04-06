import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function UserPage() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          I'm here
        </Typography>
      </Box>
    </Container>
  );
}

export default UserPage;
