import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import {Button} from "@mui/material";

function VoteBtn({ candidateId }) {
  const { state: { contract, accounts } } = useEth();
  const [inputValue, setInputValue] = useState("");

  // const handleInputChange = e => {
  //   if (/^\d+$|^$/.test(e.target.value)) {
  //     setInputValue(e.target.value);
  //   }
  // };

  const vote = async e => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    // if (inputValue === "") {
    //   alert("Please enter a value to vote.");
    //   return;
    // }
    // const newValue = parseInt(inputValue);
    await contract.methods.vote(candidateId,1,0).send({ from: accounts[0] });
  };

  return (
    <Button onClick={vote} variant="contained" color="primary">
      Vote
    </Button>
  );
}

export default VoteBtn;
