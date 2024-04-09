import { useState,useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import ProposalList from "./ProposalList";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Demo() {
  const { state } = useEth();
  const [tokens, setTokens] = useState(0);
  const [votesCasted, setVotedCasted] = useState(0);

  const getVoterInfo = async () => {
    const voterInfo = await state.contract.methods.getVoterStatus(state.accounts[0]).call();
    setTokens(voterInfo.tokens);
    setVotedCasted(voterInfo.voted);
  };

  const resetToken = async () => {
    await state.contract.methods.resetTokens().send({ from: state.accounts[0] });
    getVoterInfo();
  }

  useEffect(() => {
    if (state.contract && state.accounts) {
      getVoterInfo();
    }
  }, [state.contract, state.accounts]);

  const demo =
    <>
      <p>Account address: {state.accounts ? state.accounts[0] : ''}</p>
      <p>Remaining Tokens: {tokens}</p>
      <p>Votes Casted: {votesCasted}</p>
      <p><btn onClick={resetToken}>Refresh</btn></p>
      <hr />
      <div className="contract-container">
        <ProposalList />
      </div>
    </>;

  return (
    <div className="demo">
      <Title />
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
            demo
      }
    </div>
  );
}

export default Demo;
