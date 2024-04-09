import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function VoteBtn({ candidateId }) {
  const { state: { contract, accounts } } = useEth();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  const vote = async e => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputValue === "") {
      alert("Please enter a value to vote.");
      return;
    }
    const newValue = parseInt(inputValue);
    // await contract.methods.vote(candidateId,newValue).send({ from: accounts[0] });
  };

  return (
    <div onClick={vote} className="input-btn">
        vote(<input
          type="text"
          placeholder="uint"
          value={inputValue}
          onChange={handleInputChange}
        />)
    </div>
  );
}

export default VoteBtn;
