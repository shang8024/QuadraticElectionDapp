const Election = artifacts.require("Election");
const QuadraDAO = artifacts.require("QuadraDAO");

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
  await deployer.deploy(QuadraDAO, "0x86ac468be9cCE2B3b7C718D2b6922f3307915513");
  await deployer.deploy(Election, "0x86ac468be9cCE2B3b7C718D2b6922f3307915513", QuadraDAO.address);
};
