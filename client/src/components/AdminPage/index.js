import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import { ethers } from 'ethers';
import QuadraDAOABI from '../../contracts/QuadraDAO.json';
import "../../styles.css";
import useEth from "../../contexts/EthContext/useEth";
import io from 'socket.io-client';

function AdminPage() {
  // States to store different categories of users
  const [allUsers, setAllUsers] = useState([]);
  const [whitelistedUsers, setWhitelistedUsers] = useState([]);
  const [anonymousVoters, setAnonymousVoters] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');
  const { state:{contract, nft_contract_address,accounts} } = useEth();


  const socket = io('http://localhost:4000');
  // Deploying 'QuadraDAO' contract address after running truffle migrate --reset

  // Fetch users from localStorage on component mount
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
            console.log("Please connect to MetaMask.");
        } else {
            setCurrentAccount(accounts[0]);
        }
    };

    // Setup to listen for account changes if the Ethereum provider is available
    if (window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' })
            .then(handleAccountsChanged)
            .catch((err) => {
                console.error(err);
            });

        window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    // WebSocket listener for user data
    socket.on('updateUsers', users => {
      setAllUsers(Object.keys(users)); // Assuming users are sent as an object {username: userData}
      // Assume userData format: { whitelisted: boolean, voter: boolean }
      setWhitelistedUsers(Object.keys(users).filter(username => users[username].whitelisted));
      setAnonymousVoters(Object.keys(users).filter(username => users[username].voter));
    });

    // Cleanup function
    return () => {
        if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
        socket.off('updateUsers');
    };
  }, [socket]);

  // Handler for generating NFT

  // const handleGenerateNFTs = async () => {
  //   try {
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       const signer = provider.getSigner();
  //       const account = await signer.getAddress();
  //       console.log("Account:", account);
  //   } catch (error) {
  //       console.error("Error:", error);
  //   }
  // };

  //add user account [ accounts[1]]
  const handleGenerateNFTs = async (userAddress = accounts[0]) => {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    //await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log(window.ethereum);
    const account = await signer.getAddress();
    console.log("Account:", account);
    const checkedAddress = ethers.utils.getAddress(userAddress);
    const contract = new ethers.Contract(nft_contract_address, QuadraDAOABI.abi, signer);

    try {
        const transaction = await contract.safeMint(checkedAddress, 'https://ipfs.io/ipfs/QmS6pfArdSefpB9F3uemwvrACdexTiQuQ1iAonMhmyBw66');
        await transaction.wait();
        console.log(`NFT generated for ${userAddress}`);
        socket.emit('nftGenerated', {userAddress, message: `NFT generated for ${userAddress}`});
    } catch (error) {
        console.error(`Error generating NFT for ${userAddress}:`, error);
    }
};


  // Handler for whitelisting user
  const handleWhitelistUser = (username) => {
    console.log(`Whitelist ${username}`);
    // Add integration logic here
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h3" sx={{ mt: 2, mb: 2 }}>
        Admin Dashboard
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">All Users</Typography>
        <List>
          {allUsers.map((user) => (
            <ListItem key={user}>
              <ListItemText primary={user} sx={{ '.MuiTypography-root': { fontSize: '1.3rem' } }} />
              {whitelistedUsers.includes(user) && (
                <Button onClick={() => handleWhitelistUser(user)} sx={{ backgroundColor: '#0F52BA', color: 'white', '&:hover': { backgroundColor: 'darkgray' }, }}>Whitelist User</Button>
              )}
              {anonymousVoters.includes(user) && (
                //add user account [ accounts[1]]
              <Button 
                onClick={() => handleGenerateNFTs("0x4dA4e71E6c23bea73fee99324EB2Be009F9AE676")} // Pass dynamic address
                sx={{ backgroundColor: '#228B22', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}>
                Generate NFT
              </Button>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ p: 2, border: '1px dashed grey' }}>
        <Typography variant="body1">
          Admin Metamask Account: {currentAccount || 'Not Connected'}
        </Typography>
      </Box>
    </Container>
  );
}

export default AdminPage;
