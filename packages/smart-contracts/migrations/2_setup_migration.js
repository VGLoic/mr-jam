const Oracle = artifacts.require("Oracle");
const ProjectRegistry = artifacts.require("ProjectRegistry");

module.exports = async function(deployer) {
  // deployment steps
  await deployer.deploy(Oracle);
  await deployer.deploy(ProjectRegistry, Oracle.address);
};