import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import useEth from "../../contexts/EthContext/useEth";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  LinearProgress,
  Alert,
  Snackbar,
  Grid,
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const CreateProposal = () => {
  const { state: { contract, accounts } } = useEth();
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successSubmit, setSuccessSubmit] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessSubmit(false);
    console.log(dayjs(startDate).unix(), dayjs(endDate).unix());
    contract.methods.createProposal(title, description).send({ from: accounts[0] })
    
  };

  return (
    <Container
      maxWidth='sm'
      style={{
        marginLeft: "0px",
        marginRight: "0px",
        padding: "24px",
      }}
    >
      <h2>Create Proposal</h2>
      <Box
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete='off'
      >
        <Stack spacing={2}>
          <TextField
            id='outlined-basic'
            label='Proposal Title'
            placeholder='Enter the position title'
            variant='outlined'
            color='secondary'
            fullWidth
            style={{
              width: "100%",
              marginLeft: "0",
              marginRight: "0",
            }}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            id='outlined-textarea'
            label='Proposal Description'
            placeholder='Enter a description...'
            multiline
            rows={16}
            color='secondary'
            fullWidth
            style={{
              width: "100%",
              marginLeft: "0",
              marginRight: "0",
            }}
            onChange={(e) => setDescription(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={0} columns={8}>
            <Grid item xs={4} width='100%'>
                <DatePicker 
                    value={endDate}
                    color='secondary'
                    label='Start Date'
                    onChange={(newDate) => setStartDate(newDate)}
                    renderInput={(params) => (
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        <TextField {...params} color='secondary' />
                    )}
                />
              </Grid>
              <Grid item xs={4}>
                <DatePicker 
                    value={endDate}
                    label='End Date'
                    color='secondary'
                    onChange={(newDate) => setEndDate(newDate)}
                    renderInput={(params) => (
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        <TextField {...params} color='secondary' />
                    )}
                />
              </Grid>
        </Grid>
        </LocalizationProvider>
          <Button onClick={onSubmit} variant='contained' color='secondary'>
            Post
          </Button>
        </Stack>
      </Box>
      <Snackbar
        open={successSubmit}
        autoHideDuration={6000}
        onClose={() => setSuccessSubmit(false)}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Alert severity='success'>Submit Success!</Alert>
      </Snackbar>
      {loading && (
        <LinearProgress
          sx={{
            position: "fixed",
            width: "100%",
            bottom: "10px",
            left: 0,
            height: "10px",
          }}
          color='secondary'
        />
      )}
    </Container>
  );
};

export default CreateProposal;