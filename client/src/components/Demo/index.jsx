import React, { useState, useEffect } from "react";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import CandidateList from "./CandidateList";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


// type Checked = DropdownMenuCheckboxItemProps["checked"];

function Demo() {
  const { state } = useEth();
  const [tokens, setTokens] = useState(0);
  const [votesCasted, setVotedCasted] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState()
  const [showStatusBar, setShowStatusBar] = useState(false)
  const [showPanel, setShowPanel] = useState(false);

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

  const getDropDownAccountMenuItem = (account, index) => {
    console.log(index, account)
    return <DropdownMenuCheckboxItem
      checked={showStatusBar && selectedAccount === account}
      onCheckedChange={(something) => {
        setSelectedAccount(account);
        setShowStatusBar(something);
      }}
    >
      {account}
    </DropdownMenuCheckboxItem>
  }


  const demo =
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline">Accounts</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {state.accounts && state.accounts.map((account, index) => getDropDownAccountMenuItem(account, index))}
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="mt-8 scroll-m-20 text-m font-semibold tracking-tight">Account address: {state.accounts ? state.accounts[0] : ''}</p>
      <p class="mt-8 scroll-m-20 text-m font-semibold tracking-tight">
        Remaining Tokens: {tokens}</p>
      <p className="mt-8 scroll-m-20 text-m font-semibold tracking-tight">
        Votes Casted: {votesCasted}
      </p>
      <Button onClick={resetToken}>Refresh</Button>
      <hr />
      <div className="contract-container">
        <CandidateList account={selectedAccount} />
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
