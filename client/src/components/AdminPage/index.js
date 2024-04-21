import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import { ethers } from 'ethers';
import QuadraDAOABI from '../../contracts/QuadraDAO.json';
import useEth from "../../contexts/EthContext/useEth";
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function AdminPage() {
  // States to store different categories of users
  const [allUsers, setAllUsers] = useState([]);
  const [whitelistedUsers, setWhitelistedUsers] = useState([]);
  const [anonymousVoters, setAnonymousVoters] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');
  const { state:{contract, nft_contract_address,accounts} } = useEth();


  
  // Deploying 'QuadraDAO' contract address after running truffle migrate --reset

  // Fetch users from localStorage on component mount
  useEffect(() => {
        console.log("Contract Address:", nft_contract_address);
		socket.emit('requestAllUsers'); // Request all users on component mount

		socket.on('updateUsers', users => {
			setAllUsers(Object.entries(users).map(([username, details]) => ({ username, ...details })));
		});
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
      // Listen for real-time updates on users

    // Cleanup function
    return () => {
        if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
        socket.off('updateUsers');
    };
  }, [nft_contract_address]);

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
  const handleGenerateNFTs = async (username) => {
    if (!nft_contract_address) {
        console.error("Contract address is not set.");
        return;
    }
    console.log(`Generating NFT for ${username}`);
    const user = allUsers.find(user => user.username === username);
    console.log(`Account found for ${username}: ${user.account}`);
    if (!user || !user.account) {
        console.error("No account available for this user.");
        return;
    }
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    console.log("Account:", account);
    //const checkedAddress = ethers.utils.getAddress(username);
    const contract = new ethers.Contract(nft_contract_address, QuadraDAOABI.abi, signer);

    try {
        const transaction = await contract.safeMint(user.account, 'https://ipfs.io/ipfs/QmS6pfArdSefpB9F3uemwvrACdexTiQuQ1iAonMhmyBw66');
        await transaction.wait();
        const receipt = await transaction.wait();
        console.log("Transaction Receipt:", receipt);

        if (receipt.events && receipt.events.length > 0) {
            const tokenId = receipt.events[0].args.tokenId;
            const tokenURI = await contract.tokenURI(tokenId);
            console.log(`NFT generated for ${username}`, tokenId.toString(), tokenURI);
            socket.emit('nftGenerated', { username, tokenId: tokenId.toString(), tokenURI, message: `NFT generated for ${username}` });
        } else {
            console.error("No events were emitted or transaction failed");
        }
        // const tokenId = transaction.events[0].args.tokenId;
        // const tokenURI = await contract.tokenURI(tokenId);
        // console.log(`NFT generated for ${username}`);
        // socket.emit('nftGenerated', { username, tokenId: tokenId.toString(), tokenURI, message: `NFT generated for ${username}` });
    } catch (error) {
        console.error(`Error generating NFT for ${username}:`, error);
    }
    
  };


  // Handler for whitelisting user
  const handleWhitelistUser = (username) => {
    console.log(`Whitelist ${username}`);
    // Add integration logic here
  };

  return (
    <Container component="main" maxWidth="xs">
			<Typography component="h1" variant="h3">Admin Dashboard</Typography>
			<List>
				{allUsers.map((user) => (
					<ListItem key={user.username}>
						<ListItemText primary={user.username} />
						{user.whitelisted && (
							<Button
								onClick={() => handleWhitelistUser(user.username)}
								sx={{ backgroundColor: '#0F52BA', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
							>
								Whitelist User
							</Button>
						)}
						{user.voter && (
							<Button
								onClick={() => handleGenerateNFTs(user.username)}
								sx={{ backgroundColor: '#228B22', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
							>
								Generate NFT
							</Button>
						)}
							</ListItem>
				))}
			</List>
            <Box sx={{ p: 2, border: '1px dashed grey' }}>
                <Typography variant="body1">
                    Admin Metamask Account: {currentAccount || 'Not Connected'}
                </Typography>
            </Box>
    </Container>
	);
}

export default AdminPage;
