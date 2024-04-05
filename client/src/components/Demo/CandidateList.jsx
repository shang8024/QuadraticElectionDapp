import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import VoteBtn from "./VoteBtn";

const CandidateItem = ({ id, name, voteCount,reload, account }) => {
    console.log(id, name, voteCount);
    return (
        <tr>
            <th scope="row">{id}</th>
            <td>{name}</td>
            <td>{voteCount}</td>
            <td><VoteBtn candidateId={id} reload={reload} account={account}/></td>
        </tr>
    );
};

function CandidateList({ account }) {
  const { state: { contract, accounts } } = useEth();

  const [candidates, setCandidates] = useState([]);

  const getCandidates = async () => {
    const list = await contract.methods.getCandidates().call();
    setCandidates(list);
  };

    useEffect(() => {
        if (contract) {
            getCandidates();
        }
    }, [contract]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Election Results
          </h2>
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
              <tbody id="candidatesResults">
                {candidates.map((candidate, index) => 
                    <CandidateItem key={index} id={candidate.id} name={candidate.name} voteCount={candidate.voteCount} reload={getCandidates} account={account} />
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

export default CandidateList;
