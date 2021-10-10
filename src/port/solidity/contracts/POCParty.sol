// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20;

contract Party {
    address payable public host;
    string public name;
    uint256 public maxAttendees;
    uint256 public baseEntranceFee;
    uint256 public maxInvitesPerAttendee;

    constructor(
        string memory _name,
        uint256 _maxAttendees,
        uint256 _baseEntranceFee,
        uint256 _maxInvitesPerAttendee
    ) {
        host = payable(msg.sender);
        name = _name;
        maxAttendees = _maxAttendees;
        baseEntranceFee = _baseEntranceFee;
        maxInvitesPerAttendee = _maxInvitesPerAttendee;

        isInvited[host] = true;
    }

    uint32 public attendees = 1;
    mapping(address => bool) public isInvited;

    mapping(address => address[]) _inviteChain;

    function invite(address invitee) public payable {
        require(isInvited[msg.sender], 'Sender must have been invited.');
        require(attendees < maxAttendees, 'Party full!');
        require(
            _inviteChain[msg.sender].length < maxInvitesPerAttendee,
            'Invites already used.'
        );
        require(!isInvited[invitee], 'Invitee has already been invited.');

        uint256 cost = inviteCost();
        require(msg.value >= cost, 'Must pay for invite.');

        isInvited[invitee] = true;
        _inviteChain[msg.sender].push(invitee);
        attendees++;

        if (msg.value > cost) {
            // send tip to host
            host.transfer(msg.value - cost);
        }

        emit Invited(msg.sender, invitee);
    }

    function inviteCost() public view returns (uint256) {
        return baseEntranceFee << uint256(_inviteChain[msg.sender].length);
    }

    event Invited(address indexed sender, address indexed invitee);
}
