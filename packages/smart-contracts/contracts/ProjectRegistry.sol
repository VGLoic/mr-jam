pragma solidity ^0.6.2;

import "./Project.sol";

contract ProjectRegistry {
    mapping(bytes32 => address) public registry;

    function registerProject(bytes32 projectHash) public {
        require(registry[projectHash] == address(0), "ProjectRegistry: project has already been registered");

        Project newProject = new Project(msg.sender);
        registry[projectHash] = address(newProject);
    }
}