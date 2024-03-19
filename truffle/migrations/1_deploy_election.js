const Election = artifacts.require("Election");

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts();
  await deployer.deploy(Election, accounts[0]);
};
