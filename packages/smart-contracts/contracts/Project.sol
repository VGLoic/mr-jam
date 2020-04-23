pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Project is ERC20, Ownable {
    struct Bounty {
        bool closed;
        uint256 amount;
        // Based on oracle
        address[] participants;
    }

    uint256 constant INITIAL_BALANCE = 100;

    mapping(address => bool) public membership;
    mapping(uint256 => Bounty) public bounties;

    constructor(address managerAccount) ERC20("Test Merge Token Coolos ", "TMTC") public {
        // The manager becomes the owner
        transferOwnership(managerAccount);
        // Register the manager as member and transfer the initial balance
        _addMember(managerAccount);
    }

    modifier onlyMember() {
        require(membership[_msgSender()], "Project: caller is not a member");
        _;
    }

    function addMember(address account) public onlyOwner returns (bool) {
        _addMember(account);
        return true;
    }

    function contribute(uint256 mrId, uint256 amount) public onlyMember returns (bool) {
        require(!bounties[mrId].closed, "Project: Bounty is closed");
        _burn(_msgSender(), amount);
        bounties[mrId].amount = bounties[mrId].amount.add(amount);
        return true;
    }

    // Based on oracle
    function closeBounty(uint256 mrId) public onlyOwner returns (bool) {
        require(!bounties[mrId].closed, "Project: Bounty is closed");
        bounties[mrId].closed = true;
        return true;
    }

    // Based on oracle
    function redeem(uint256 mrId) public onlyMember returns (bool) {
        Bounty memory bounty = bounties[mrId];
        require(bounty.closed, "Project: Bounty is not closed");
        require(isParticipant(msg.sender, mrId), "Project: Sender is not a participant");
        _removeParticipant(msg.sender, mrId);
        _mint(msg.sender, bounty.amount);
        return true;
    }

    // Based on oracle
    function addParticipant(address account, uint256 mrId) public onlyOwner returns (bool) {
        _addParticipant(account, mrId);
    }

    // Based on oracle
    function isParticipant(address account, uint256 mrId) public view returns (bool) {
        address[] memory participants = bounties[mrId].participants;
        uint256 iterator;
        bool isFound;
        while (!isFound && iterator < participants.length) {
            isFound = participants[iterator] == account;
            iterator = iterator.add(1);
        }
        return isFound;
    }
 
    function _addMember(address account) internal {
        require(!membership[account], "Project: account is already a member");
        // The account is registered as member
        membership[account] = true;
        // The account receives the initial balance
        _mint(account, INITIAL_BALANCE);
    }

    function _removeParticipant(address account, uint256 mrId) internal {
        address[] storage participants = bounties[mrId].participants;
        uint256 numberOfParticipants = participants.length;
        uint256 accountIndex;
        bool isAccountFound;
        uint256 iterator;
        while (!isAccountFound && iterator < numberOfParticipants) {
            if (participants[iterator] == account) {
                isAccountFound = true;
                accountIndex = iterator;
            }
            iterator = iterator.add(1);
        }
        if (isAccountFound) {
            participants[accountIndex] = participants[numberOfParticipants - 1];
            participants.pop();
        }
    }

    function _addParticipant(address account, uint256 mrId) internal {
        require(!isParticipant(account, mrId), "Project: account is already a participant");
        require(!bounties[mrId].closed, "Project: Bounty is closed");
        bounties[mrId].participants.push(account);
    }
}
