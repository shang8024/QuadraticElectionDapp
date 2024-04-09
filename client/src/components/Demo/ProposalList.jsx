import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import VoteBtn from "./VoteBtn";

const proposalStatus = {
  IN_PROGRESS: 0,
  APPROVED: 1,
  REJECTED: 2,
  ENDED: 3,
};

const ProposalItem = ({ proposal}) => {
  const {id, title, status, downvotes, upvotes} = proposal;
  const totalVotes = parseInt(downvotes) + parseInt(upvotes);
  return (
    <TableRow key={id}>
      <TableCell component="th" scope="row">
        {id}
      </TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>{totalVotes}</TableCell>
      <TableCell>{status == proposalStatus.IN_PROGRESS ? "In Progress" : status == proposalStatus.APPROVED ? "Approved" : status == proposalStatus.REJECTED ? "Rejected" : "Ended"}</TableCell>
      <TableCell>
        <VoteBtn candidateId={id} />
      </TableCell>
    </TableRow>
    );
};

function ProposalList() {
  const { state: { contract, accounts } } = useEth();

  const [proposals, setProposals] = useState([]);

  const getProposals = async () => {
    const list = await contract.methods.getProposals().call();
    console.log(list);
    //setProposals(list);
    if (list) {
      setProposals(list);
    } else {
        setProposals([]); // Ensure proposals is always an array
    }
  };

    useEffect(() => {
        if (contract) {
            getProposals();
        }
    }, [contract]);

  return (
    <div className="container" style={{width: "100%", }}>
      <div className="row">
        <div className="col-lg-12">
          <h1 className="text-center">Election Results</h1>
          <hr/>
          <br/>
          {
            !contract ? <div id="loader"><p className="text-center">Loading...</p></div>
            : 
            <div id="content">
            <Button
            fullWidth
            variant="contained"
            href="/createProposal"
            >
            Create Proposal
            </Button>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, minHeight:600 }} aria-label="simple table">
                  <TableHead>
                  <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Voted</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Vote</TableCell>
                  </TableRow>
                  </TableHead>
                  <TableBody>
                    {proposals.map((proposal, index) => 
                      <ProposalItem key={index} proposal={proposal} reload={getProposals}/>
                    )}
                  </TableBody>
              </Table>
            </TableContainer>
          </div>
          }

          
        </div>
      </div>
    </div>
  );
}

export default ProposalList;
