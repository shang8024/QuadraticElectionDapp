import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button } from "@mui/material";
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
        <tr>
            <th>{id}</th>
            <td>{title}</td>
            <td>{totalVotes}</td>
            <td>{status == proposalStatus.IN_PROGRESS ? "In Progress" : status == proposalStatus.APPROVED ? "Approved" : status == proposalStatus.REJECTED ? "Rejected" : "Ended"}</td>
            <td><VoteBtn candidateId={id} /></td>
        </tr>
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
    <div className="container">
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
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Voted</th>
                  <th scope="col">Status</th>
                  <th scope="col">Vote</th>
                </tr>
              </thead>
              <tbody id="proposalsResults">
                {proposals.map((proposal, index) => 
                    <ProposalItem key={index} proposal={proposal} reload={getProposals}/>
                )}
              </tbody>
            </table>
          </div>
          }

          
        </div>
      </div>
    </div>
  );
}

export default ProposalList;
