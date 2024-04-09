import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

const proposalStatus = {
  IN_PROGRESS: 0,
  APPROVED: 1,
  REJECTED: 2,
  ENDED: 3,
};

const ProposalItem = ({ id, title, voteCount,reload}) => {
    return (
        <tr>
            <th>{id}</th>
            <td>{title}</td>
            <td>{voteCount}</td>
        </tr>
    );
};

function ProposalList() {
  const { state: { contract, accounts } } = useEth();

  const [proposals, setProposals] = useState([]);

  const getProposals = async () => {
    const list = await contract.methods.getProposals().call();
    console.log(list);
    setProposals(list);
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
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Votes</th>
                  <th scope="col">Vote</th>
                </tr>
              </thead>
              <tbody id="proposalsResults">
                {proposals.map((candidate, index) => 
                    <ProposalItem key={index} id={candidate.id} name={candidate.name} voteCount={candidate.voteCount} reload={getProposals}/>
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
