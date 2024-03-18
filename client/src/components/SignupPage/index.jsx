import React, { useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import {
  Container
  , Box
  , Typography
  , TextField
  , Button
  , Grid
  , Link
} from "@mui/material";
import useEth from "../../contexts/EthContext/useEth";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = useEth();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here, e.g., validation, API calls
    console.log("Signup with:", username, password, state?.accounts[0]);
  };

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
        <Typography component="h1" variant="h2">
            User Signup
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <Typography component="h3" variant="h6">
            Adddress: {state && state.accounts ? state.accounts[0] : "Not connected"}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
          >
              Sign Up
          </Button>
          <Grid container>
            <Grid item xs/>
            <Grid item >
              <Link variant="body2" component={RouterLink} to="/">
                {"Already have an account? Sign in"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignupPage;