import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useEth from "../../contexts/EthContext/useEth";

function VoteBtn({ candidateId, account }) {
  const {
    state: { contract, accounts },
  } = useEth();

  console.log("VoteBtn accounts");
  console.log(accounts);

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  const vote = async (e) => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputValue === "") {
      alert("Please enter a value to vote.");
      return;
    }
    const newValue = parseInt(inputValue);

    console.log("sending from account: " + account);
    await contract.methods
      .vote(candidateId, newValue)
      .send({ from: account });
  };

  return (
    <div className="flex">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Number of votes"
          value={inputValue}
          onChange={handleInputChange}
        />
        <Button type="submit" onClick={vote}>
          Vote
        </Button>
      </div>
    </div>
  );
}

export default VoteBtn;
