pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Oracle.sol";

contract Project is ERC20, Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    struct Bounty {
        uint256 amount;
        mapping(address => uint256) contributions;
        EnumerableSet.AddressSet registeredRedeemers;
    }

    struct Member {
        bool membership;
        uint256 id;
    }

    uint256 constant INITIAL_BALANCE = 100;

    Oracle public oracle;
    uint256 public projectId;
    mapping(address => Member) public members;
    address[] public memberList;
    mapping(uint256 => Bounty) bounties;

    constructor(
        uint256 _projectId,
        address managerAccount,
        uint256 managerId,
        address[] memory additionalAccounts,
        uint256[] memory additionalIds,
        address _oracleAddress
    ) ERC20("Test Merge Token Coolos ", "TMTC") public {
        require(_oracleAddress != address(0), "Project: oracleAddress can not be the zero address");
        require(additionalAccounts.length == additionalIds.length, "Project: additional accounts and ids must be of the same length");
        projectId = _projectId;
        oracle = Oracle(_oracleAddress);
        // The manager becomes the owner
        transferOwnership(managerAccount);
        // Register the manager as member and transfer the initial balance
        _addMember(managerAccount, managerId);
        // Register the additional users
        uint256 index;
        while (index < additionalAccounts.length) {
            _addMember(additionalAccounts[index], additionalIds[index]);
            index = index.add(1);
        }
    }

    modifier onlyMember() {
        require(isMember(_msgSender()), "Project: caller is not a member");
        _;
    }

    function addMember(address account, uint256 id) public onlyOwner returns (bool) {
        _addMember(account, id);
        return true;
    }

    function addMembers(
        address[] memory additionalAccounts,
        uint256[] memory additionalIds
    ) public onlyOwner returns (bool) {
        require(additionalAccounts.length == additionalIds.length, "Project: additional accounts and ids must be of the same length");
        // Register the additional users
        uint256 index;
        while (index < additionalAccounts.length) {
            _addMember(additionalAccounts[index], additionalIds[index]);
            index = index.add(1);
        }
    }

    function contribute(uint256 mrId, uint256 amount) public onlyMember returns (bool) {
        address sender = _msgSender();
        require(oracle.isMergeRequestOpened(projectId, mrId), "Project: merge request is not opened");
        require(!oracle.isParticipant(projectId, mrId, members[sender].id), "Project: sender is already a participant");
        _burn(sender, amount);
        bounties[mrId].amount = bounties[mrId].amount.add(amount);
        bounties[mrId].contributions[sender] = bounties[mrId].contributions[sender].add(amount);
        return true;
    }

    function redeem(uint256 mrId) public onlyMember returns (bool) {
        address sender = _msgSender();
        Bounty storage bounty = bounties[mrId];
        require(oracle.isMergeRequestMerged(projectId, mrId), "Project: merge request is not merged");
        require(oracle.isParticipant(projectId, mrId, members[sender].id), "Project: sender is not a participant");
        require(!bounty.registeredRedeemers.contains(sender), "Project: sender has already redeemed");
        bounty.registeredRedeemers.add(sender);
        _mint(sender, bounty.amount);
        return true;
    }

    function isMember(address account) public view returns (bool) {
        return members[account].membership;
    }

    function isIdRegistered(uint256 id) public view returns (bool) {
        uint256 index;
        bool isIdMember;
        while (!isIdMember && index < memberList.length) {
            isIdMember = members[memberList[index]].id == id;
            index = index.add(1);
        }
        return isIdMember;
    }

    function getMembers() public view returns (address[] memory, uint256[] memory) {
        uint256[] memory ids = new uint256[](memberList.length);

        for (uint256 i; i < memberList.length; i++) {
            ids[i] = members[memberList[i]].id;
        }

        return (
            memberList,
            ids
        );
    }

    function getBountyDetails(uint256 mrId) public view returns (
        uint256 bountyAmount,
        bool hasRedeemed,
        bool isContributor
    ) {
        Bounty storage bounty = bounties[mrId];
        bountyAmount = bounty.amount;
        hasRedeemed = bounty.registeredRedeemers.contains(_msgSender());
        isContributor = bounty.contributions[_msgSender()] > 0;

        return (
            bountyAmount,
            hasRedeemed,
            isContributor
        );
    }

    function _addMember(address account, uint256 id) internal {
        require(account != address(0), "Project: account can not be the zero address");
        require(!isMember(account), "Project: account is already a member");
        require(!isIdRegistered(id), "Project: id is already assigned");
        // The account is registered as member
        members[account] = Member(true, id);
        memberList.push(account);
        // The account receives the initial balance
        _mint(account, INITIAL_BALANCE);
    }
}
