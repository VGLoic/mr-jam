const ProjectRegistry = artifacts.require("ProjectRegistry");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(ProjectRegistry);
};