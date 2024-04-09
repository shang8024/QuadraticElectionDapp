const Election = artifacts.require("Election");
const QuadraDAO = artifacts.require("QuadraDAO");

const {PUBLIC_KEY} = process.env;

module.exports = async function (deployer) {
  await deployer.deploy(QuadraDAO, PUBLIC_KEY);
  await deployer.deploy(Election, PUBLIC_KEY, QuadraDAO.address);
};
