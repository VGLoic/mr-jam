pragma solidity ^0.6.2;

import "./Project.sol";

contract ProjectRegistry {
    address public oracleAddress;
    mapping(bytes32 => address) public registry;

    constructor(address _oracleAddress) public {
        require(_oracleAddress != address(0), "ProjectRegistry: oracleAddress can not be the zero address");
        oracleAddress = _oracleAddress;
    }

    function registerProject(
        bytes32 projectHash,
        address managerAccount,
        uint256 managerId,
        address[] memory additionalAccounts,
        uint256[] memory additionalIds
    ) public {
        require(registry[projectHash] == address(0), "ProjectRegistry: project has already been registered");

        Project newProject = new Project(projectHash, managerAccount, managerId, additionalAccounts, additionalIds, oracleAddress);
        registry[projectHash] = address(newProject);
    }
}