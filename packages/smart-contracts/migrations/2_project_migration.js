const Project = artifacts.require("Project");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(Project, 100000000);
};