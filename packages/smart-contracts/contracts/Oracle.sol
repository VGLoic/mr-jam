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

    mapping(uint256 => mapping(uint256 => MergeRequest)) private _mergeRequests;

    /**
     * Add a participant to a merge request of a project
     * @param projectId Gitlab ID of the project
     * @param mrId Gitlab ID of the merge request
     * @param userId Gitlab ID of the user
     */
    function addParticipant(uint256 projectId, uint256 mrId, uint256 userId) public onlyOwner {
        _mergeRequests[projectId][mrId].participants.add(userId);
    }

    /**
     * Remove a participant to a merge request of a project
     * @param projectId Gitlab ID of the project
     * @param mrId Gitlab ID of the merge request
     * @param userId Gitlab ID of the user
     */
    function removeParticipant(uint256 projectId, uint256 mrId, uint256 userId) public onlyOwner {
        _mergeRequests[projectId][mrId].participants.remove(userId);
    }

    /**
     * Update the state of a merge request of a project to Closed
     * @param projectId Gitlab ID of the project
     * @param mrId Gitlab ID of the merge request
     */
    function updateStateToClosed(uint256 projectId, uint256 mrId) public onlyOwner {
        _mergeRequests[projectId][mrId].state = MergeRequestState.Closed;
    }

    /**
     * Update the state of a merge request of a project to Merged
     * @param projectId Gitlab ID of the project
     * @param mrId Gitlab ID of the merge request
     */
    function updateStateToMerged(uint256 projectId, uint256 mrId) public onlyOwner {
        _mergeRequests[projectId][mrId].state = MergeRequestState.Merged;
    }

    /**
     * Check if a merge request of a project is in Opened state
     * @param projectId Hash of the project
     * @param mrId Gitlab ID of the merge request
     * @return True if the merge request is in Opened state
     */
    function isMergeRequestOpened(uint256 projectId, uint256 mrId) public view returns (bool) {
        return _mergeRequests[projectId][mrId].state == MergeRequestState.Opened;
    }

    /**
     * Check if a merge request of a project is in Merged state
     * @param projectId Hash of the project
     * @param mrId Gitlab ID of the merge request
     * @return {bool} True if the merge request is in Merged state
     */
    function isMergeRequestMerged(uint256 projectId, uint256 mrId) public view returns (bool) {
        return _mergeRequests[projectId][mrId].state == MergeRequestState.Merged;
    }

    /**
     * Check if a merge request of a project is in Closed state
     * @param projectId Hash of the project
     * @param mrId Gitlab ID of the merge request
     * @return {bool} True if the merge request is in Closed state
     */
    function isMergeRequestClosed(uint256 projectId, uint256 mrId) public view returns (bool) {
        return _mergeRequests[projectId][mrId].state == MergeRequestState.Merged;
    }

    /**
     * Check if a user is a participant to a merge request of a project
     * @param projectId Hash of the project
     * @param mrId Gitlab ID of the merge request
     * @param userId Gitlab ID of the user
     * @return {bool} True if the user belongs to the participants
     */
    function isParticipant(uint256 projectId, uint256 mrId, uint256 userId) public view returns (bool) {
        return _mergeRequests[projectId][mrId].participants.contains(userId);
    }
}