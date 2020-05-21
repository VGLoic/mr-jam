pragma solidity ^0.6.2;

import "./Project.sol";

contract ProjectRegistry {
    address public oracleAddress;
    mapping(uint256 => address) public registry;

    constructor(address _oracleAddress) public {
        require(_oracleAddress != address(0), "ProjectRegistry: oracleAddress can not be the zero address");
        oracleAddress = _oracleAddress;
    }

    function registerProject(
        uint256 projectId,
        address managerAccount,
        uint256 managerId,
        address[] memory additionalAccounts,
        uint256[] memory additionalIds
    ) public {
        require(registry[projectId] == address(0), "ProjectRegistry: project has already been registered");

        Project newProject = new Project(projectId, managerAccount, managerId, additionalAccounts, additionalIds, oracleAddress);
        registry[projectId] = address(newProject);
    }
}