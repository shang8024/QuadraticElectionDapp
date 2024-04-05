import { Button } from "@/components/ui/button";

// function Link({ uri, text }) {
//   return <a href={uri} target="_blank" rel="noreferrer" className="p-5">
//     {text}
//     </a>;
// }

function Footer() {
  return (
    <footer>
      <h2>More resources</h2>
      <Button variant="link" className="text-black">
        <a href="href=https://trufflesuite.com">
        Truffle
        </a>
      </Button>
      <Button variant="link" className="text-black" href={"https://reactjs.org"}>
      React
      </Button>
      <Button variant="link" className="text-black" href={"https://soliditylang.org"}>
      Solidity
      </Button>
      <Button variant="link" className="text-black" href={"https://ethereum.org"}>
      Ethereum
      </Button>
    </footer>
  );
}

export default Footer;
