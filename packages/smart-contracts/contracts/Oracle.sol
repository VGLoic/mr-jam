pragma solidity ^0.6.2;

import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Oracle is Ownable {
    using EnumerableSet for EnumerableSet.UintSet;

    enum MergeRequestState { Opened, Closed, Merged }

    struct MergeRequest {
        MergeRequestState state;
        EnumerableSet.UintSet participants;
    }

    mapping(bytes32 => mapping(uint256 => MergeRequest)) private _mergeRequests;

    /**
     * Add a participant to a merge request of a project
     * @param projectHash Hash of the project
     * @param mrId Gitlab ID of the merge request
     * @param userId Gitlab ID of the user
     */
    function addParticipant(bytes32 projectHash, uint256 mrId, uint256 userId) public onlyOwner {
        _mergeRequests[projectHash][mrId].participants.add(userId);
    }

    /**
     * Remove a participant to a merge request of a project
     * @param projectHash Hash of the project
     * @param mrId Gitlab ID of the merge request
     * @param userId Gitlab ID of the user
     */
    function removeParticipant(bytes32 projectHash, uint256 mrId, uint256 userId) public onlyOwner {
        _mergeRequests[projectHash][mrId].participants.remove(userId);
    }

    /**
     * Update the state of a merge request of a project to Closed
     * @param projectHash Hash of the project
     * @param mrId Gitlab ID of the merge request
     */
    function updateStateToClosed(bytes32 projectHash, uint256 mrId) public onlyOwner {
        _mergeRequests[projectHash][mrId].state = MergeRequestState.Closed;
    }

    /**
     * Update the state of a merge request of a project to Merged
     * @param projectHash Hash of the project
     * @param mrId Gitlab ID of the merge request
     */
    function updateStateToMerged(bytes32 projectHash, uint256 mrId) public onlyOwner {
        _mergeRequests[projectHash][mrId].state = MergeRequestState.Merged;
    }

    /**
     * Check if a merge request of a project is in Opened state
     * @param projectHash Hash of the project
     * @param mrId Gitlab ID of the merge request
     * @return True if the merge request is in Opened state
     */
    function isMergeRequestOpened(bytes32 projectHash, uint256 mrId) public view returns (bool) {
        return _mergeRequests[projectHash][mrId].state == MergeRequestState.Opened;
    }

    /**
     * Check if a merge request of a project is in Merged state
     * @param projectHash Hash of the project
     * @param mrId Gitlab ID of the merge request
     * @return {bool} True if the merge request is in Merged state
     */
    function isMergeRequestMerged(bytes32 projectHash, uint256 mrId) public view returns (bool) {
        return _mergeRequests[projectHash][mrId].state == MergeRequestState.Merged;
    }

    /**
     * Check if a merge request of a project is in Closed state
     * @param projectHash Hash of the project
     * @param mrId Gitlab ID of the merge request
     * @return {bool} True if the merge request is in Closed state
     */
    function isMergeRequestClosed(bytes32 projectHash, uint256 mrId) public view returns (bool) {
        return _mergeRequests[projectHash][mrId].state == MergeRequestState.Merged;
    }

    /**
     * Check if a user is a participant to a merge request of a project
     * @param projectHash Hash of the project
     * @param mrId Gitlab ID of the merge request
     * @param userId Gitlab ID of the user
     * @return {bool} True if the user belongs to the participants
     */
    function isParticipant(bytes32 projectHash, uint256 mrId, uint256 userId) public view returns (bool) {
        return _mergeRequests[projectHash][mrId].participants.contains(userId);
    }
}