const Election = artifacts.require("Election");
const QuadraDAO = artifacts.require("QuadraDAO");

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
  await deployer.deploy(QuadraDAO, "0x1501C15F2349B277e6848D2dC2DB000a190608a0");
  await deployer.deploy(Election, "0x1501C15F2349B277e6848D2dC2DB000a190608a0", QuadraDAO.address);
};
