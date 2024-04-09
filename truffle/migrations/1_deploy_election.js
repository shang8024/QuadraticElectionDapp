const Election = artifacts.require("Election");
const QuadraDAO = artifacts.require("QuadraDAO");

const {PUBLIC_KEY} = process.env;

module.exports = async function (deployer) {
  await deployer.deploy(QuadraDAO, PUBLIC_KEY);
  await deployer.deploy(Election, PUBLIC_KEY, QuadraDAO.address);
  
  
  // const accounts = await web3.eth.getAccounts();
  // console.log(accounts);

  // //add admin account ( accounts[0] )
  // await deployer.deploy(QuadraDAO, "0x1a9b5F2e1b6bC1100C9B4d362FE2571b1ddB94ef");
  // await deployer.deploy(Election, "0x1a9b5F2e1b6bC1100C9B4d362FE2571b1ddB94ef", QuadraDAO.address);
};
