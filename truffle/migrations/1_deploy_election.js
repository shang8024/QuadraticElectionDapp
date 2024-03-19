const Election = artifacts.require("Election");
const QuadraDAO = artifacts.require("QuadraDAO");

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts();
  await deployer.deploy(QuadraDAO, accounts[0]);
  await deployer.deploy(Election, accounts[0], QuadraDAO.address);
};
