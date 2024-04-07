pragma solidity >=0.4.22 <0.9.0;
//console log
import "truffle/console.sol";

contract Election {
    //Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        int tokens;
        int voted;
        bool valid;
    }

    //Store Candidates
    mapping(uint => Candidate) public candidates;

    //store accounts that have voted and how many votes they have cast
    mapping(address => Voter) public voters;

    //Store Candidates Count
    uint public candidatesCount;
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
    //Constructor
    constructor() {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function getCandidates() public view returns (Candidate[] memory) {
        // return all candidates
        Candidate[] memory result = new Candidate[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            result[i-1] = candidates[i];
        }
        return result;
    }

    function addVoter(address _voter) private {
        if (voters[_voter].valid == true) return;
        voters[_voter] = Voter(10, 0, true);
    }

    function getVoterStatus(address _voter) public returns (Voter memory) {
        if (!voters[_voter].valid) {
            addVoter(_voter);
        }
        // return voter status
        return voters[_voter];
    }

    function quadraticVote(int voted, int new_votes) public pure returns (int) {
        int tokens = 0;
        for (int i = 1; i <= new_votes; i++) {
            tokens += (voted + i) * (voted + i);
        }
        return tokens;
    }

    function resetTokens() public {
        voters[msg.sender].tokens = 10;
        voters[msg.sender].voted = 0;
    }

    function vote(uint _candidateId, int votes) public {
        //TODO: check voter eligibility

        //initialize voter if not already initialized
        if(!voters[msg.sender].valid){
            addVoter(msg.sender);
        }

        require(votes > 0, "Votes must be positive");

        int token_required = quadraticVote(voters[msg.sender].voted, votes);
        
        //print(token_required);
        //require have enough tokens to vote
        require(voters[msg.sender].tokens >= token_required, "Not enough tokens to vote");


        //require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        //record that voter has voted
        voters[msg.sender].tokens -= token_required;
        voters[msg.sender].voted += votes;

        //update candidate vote Count
        candidates[_candidateId].voteCount += uint256(votes);
    }

}
