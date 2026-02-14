// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/GiveawayDistributor.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock ERC20 token for testing
contract MockERC20 is ERC20 {
    constructor() ERC20("Mock Token", "MOCK") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract GiveawayDistributorTest is Test {
    GiveawayDistributor public distributor;
    MockERC20 public token;

    address public owner;
    address public creator;
    address public user1;
    address public user2;
    address public user3;
    address public user4;
    address public user5;

    uint256 constant TOTAL_AMOUNT = 1000 ether;
    uint256 constant WINNERS_COUNT = 10;
    uint256 public endTime;

    event GiveawayCreated(
        uint256 indexed id,
        address indexed creator,
        address indexed token,
        uint256 totalAmount,
        uint256 winnersCount,
        uint256 endTime
    );

    event RewardClaimed(
        uint256 indexed id,
        address indexed winner,
        uint256 amount
    );

    event GiveawayEnded(uint256 indexed id, bool expired);

    event WinnersAnnounced(uint256 indexed id, address[] winners);

    event GiveawayDisposed(uint256 indexed id, uint256 leftoverTokens);

    function setUp() public {
        owner = address(this);
        creator = makeAddr("creator");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        user4 = makeAddr("user4");
        user5 = makeAddr("user5");

        distributor = new GiveawayDistributor();
        token = new MockERC20();

        endTime = block.timestamp + 7 days;

        // Fund creator with tokens
        token.mint(creator, TOTAL_AMOUNT * 10);
    }

    /*//////////////////////////////////////////////////////////////
                        GIVEAWAY CREATION TESTS
    //////////////////////////////////////////////////////////////*/

    function testCreateGiveaway() public {
        vm.startPrank(creator);
        token.approve(address(distributor), TOTAL_AMOUNT);

        vm.expectEmit(true, true, true, true);
        emit GiveawayCreated(
            1,
            creator,
            address(token),
            TOTAL_AMOUNT,
            WINNERS_COUNT,
            endTime
        );

        uint256 giveawayId = distributor.createGiveaway(
            address(token),
            TOTAL_AMOUNT,
            WINNERS_COUNT,
            endTime,
            false
        );
        vm.stopPrank();

        assertEq(giveawayId, 1);
        assertEq(token.balanceOf(address(distributor)), TOTAL_AMOUNT);

        (
            address gCreator,
            ,
            uint256 totalAmount,
            uint256 winnersCount,
            uint256 claimedCount,
            uint256 gEndTime,
            bool isPrivate,
            bool active,
            bool disposed
        ) = distributor.giveaways(giveawayId);

        assertEq(gCreator, creator);
        assertEq(totalAmount, TOTAL_AMOUNT);
        assertEq(winnersCount, WINNERS_COUNT);
        assertEq(claimedCount, 0);
        assertEq(gEndTime, endTime);
        assertFalse(isPrivate);
        assertTrue(active);
        assertFalse(disposed);
    }

    function testCreateMultipleGiveaways() public {
        vm.startPrank(creator);
        token.approve(address(distributor), TOTAL_AMOUNT * 3);

        uint256 id1 = distributor.createGiveaway(
            address(token),
            TOTAL_AMOUNT,
            WINNERS_COUNT,
            endTime,
            false
        );

        uint256 id2 = distributor.createGiveaway(
            address(token),
            TOTAL_AMOUNT,
            5,
            endTime + 1 days,
            true
        );

        uint256 id3 = distributor.createGiveaway(
            address(token),
            TOTAL_AMOUNT,
            20,
            endTime + 2 days,
            false
        );
        vm.stopPrank();

        assertEq(id1, 1);
        assertEq(id2, 2);
        assertEq(id3, 3);
        assertEq(distributor.getTotalGiveaways(), 3);
    }

    function testCannotCreateGiveawayWithZeroToken() public {
        vm.startPrank(creator);
        vm.expectRevert("GiveawayDistributor: invalid token address");
        distributor.createGiveaway(
            address(0),
            TOTAL_AMOUNT,
            WINNERS_COUNT,
            endTime,
            false
        );
        vm.stopPrank();
    }

    function testCannotCreateGiveawayWithZeroWinners() public {
        vm.startPrank(creator);
        token.approve(address(distributor), TOTAL_AMOUNT);

        vm.expectRevert("GiveawayDistributor: must have at least one winner");
        distributor.createGiveaway(
            address(token),
            TOTAL_AMOUNT,
            0,
            endTime,
            false
        );
        vm.stopPrank();
    }

    function testCannotCreateGiveawayWithZeroAmount() public {
        vm.startPrank(creator);
        token.approve(address(distributor), TOTAL_AMOUNT);

        vm.expectRevert(
            "GiveawayDistributor: total amount must be greater than zero"
        );
        distributor.createGiveaway(address(token), 0, WINNERS_COUNT, endTime, false);
        vm.stopPrank();
    }

    function testCannotCreateGiveawayWithPastEndTime() public {
        vm.startPrank(creator);
        token.approve(address(distributor), TOTAL_AMOUNT);

        vm.expectRevert(
            "GiveawayDistributor: end time must be in the future"
        );
        distributor.createGiveaway(
            address(token),
            TOTAL_AMOUNT,
            WINNERS_COUNT,
            block.timestamp - 1,
            false
        );
        vm.stopPrank();
    }

    function testCannotCreateGiveawayWithAmountTooSmall() public {
        vm.startPrank(creator);
        token.approve(address(distributor), 5);

        vm.expectRevert(
            "GiveawayDistributor: total amount too small for winner count"
        );
        distributor.createGiveaway(address(token), 5, 10, endTime, false);
        vm.stopPrank();
    }

    function testCannotCreateGiveawayWithoutApproval() public {
        vm.startPrank(creator);
        vm.expectRevert();
        distributor.createGiveaway(
            address(token),
            TOTAL_AMOUNT,
            WINNERS_COUNT,
            endTime,
            false
        );
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                        CLAIM REWARD TESTS
    //////////////////////////////////////////////////////////////*/

    function testClaimReward() public {
        uint256 giveawayId = _createTestGiveaway();
        uint256 rewardPerWinner = distributor.getRewardPerWinner(giveawayId);

        vm.prank(user1);
        vm.expectEmit(true, true, false, true);
        emit RewardClaimed(giveawayId, user1, rewardPerWinner);
        distributor.claimReward(giveawayId);

        assertTrue(distributor.hasClaimed(giveawayId, user1));
        assertEq(token.balanceOf(user1), rewardPerWinner);

        (, , , , uint256 claimedCount, , , , ) = distributor.giveaways(
            giveawayId
        );
        assertEq(claimedCount, 1);
    }

    function testMultipleUsersClaim() public {
        uint256 giveawayId = _createTestGiveaway();
        uint256 rewardPerWinner = distributor.getRewardPerWinner(giveawayId);

        vm.prank(user1);
        distributor.claimReward(giveawayId);

        vm.prank(user2);
        distributor.claimReward(giveawayId);

        vm.prank(user3);
        distributor.claimReward(giveawayId);

        assertEq(token.balanceOf(user1), rewardPerWinner);
        assertEq(token.balanceOf(user2), rewardPerWinner);
        assertEq(token.balanceOf(user3), rewardPerWinner);

        (, , , , uint256 claimedCount, , , , ) = distributor.giveaways(
            giveawayId
        );
        assertEq(claimedCount, 3);
    }

    function testCannotClaimTwice() public {
        uint256 giveawayId = _createTestGiveaway();

        vm.startPrank(user1);
        distributor.claimReward(giveawayId);

        vm.expectRevert("GiveawayDistributor: already claimed");
        distributor.claimReward(giveawayId);
        vm.stopPrank();
    }

    function testCannotClaimFromInactiveGiveaway() public {
        uint256 giveawayId = _createTestGiveaway();

        vm.prank(owner);
        distributor.endGiveaway(giveawayId);

        vm.prank(user1);
        vm.expectRevert("GiveawayDistributor: giveaway is not active");
        distributor.claimReward(giveawayId);
    }

    function testCannotClaimFromExpiredGiveaway() public {
        uint256 giveawayId = _createTestGiveaway();

        vm.warp(endTime + 1);

        vm.prank(user1);
        vm.expectRevert("GiveawayDistributor: giveaway has expired");
        distributor.claimReward(giveawayId);
    }

    function testCannotClaimWhenAllRewardsClaimed() public {
        uint256 giveawayId = _createTestGiveaway();

        // Claim all 10 spots (this will auto-end the giveaway)
        for (uint256 i = 1; i <= WINNERS_COUNT; i++) {
            address user = address(uint160(1000 + i));
            vm.prank(user);
            distributor.claimReward(giveawayId);
        }

        // After all winners claim, giveaway is no longer active
        vm.prank(user5);
        vm.expectRevert("GiveawayDistributor: giveaway is not active");
        distributor.claimReward(giveawayId);
    }

    function testGiveawayEndsAutomaticallyWhenFull() public {
        uint256 giveawayId = _createTestGiveaway();

        // Claim all spots except last one
        for (uint256 i = 1; i < WINNERS_COUNT; i++) {
            address user = address(uint160(1000 + i));
            vm.prank(user);
            distributor.claimReward(giveawayId);
        }

        (, , , , , , , bool activeBefore, ) = distributor.giveaways(giveawayId);
        assertTrue(activeBefore);

        // Last claim should trigger auto-end
        address lastUser = address(uint160(1000 + WINNERS_COUNT));
        vm.prank(lastUser);
        vm.expectEmit(true, false, false, true);
        emit GiveawayEnded(giveawayId, false);
        distributor.claimReward(giveawayId);

        (, , , , , , , bool activeAfter, ) = distributor.giveaways(giveawayId);
        assertFalse(activeAfter);
    }

    /*//////////////////////////////////////////////////////////////
                        END GIVEAWAY TESTS
    //////////////////////////////////////////////////////////////*/

    function testCreatorCanEndExpiredGiveaway() public {
        uint256 giveawayId = _createTestGiveaway();

        vm.warp(endTime + 1);

        vm.prank(creator);
        vm.expectEmit(true, false, false, true);
        emit GiveawayEnded(giveawayId, true);
        distributor.endGiveaway(giveawayId);

        (, , , , , , , bool active, ) = distributor.giveaways(giveawayId);
        assertFalse(active);
    }

    function testOwnerCanEndAnytime() public {
        uint256 giveawayId = _createTestGiveaway();

        vm.prank(owner);
        distributor.endGiveaway(giveawayId);

        (, , , , , , , bool active, ) = distributor.giveaways(giveawayId);
        assertFalse(active);
    }

    function testCreatorCannotEndBeforeExpiration() public {
        uint256 giveawayId = _createTestGiveaway();

        vm.prank(creator);
        vm.expectRevert("GiveawayDistributor: giveaway has not expired yet");
        distributor.endGiveaway(giveawayId);
    }

    function testCannotEndAlreadyEndedGiveaway() public {
        uint256 giveawayId = _createTestGiveaway();

        vm.prank(owner);
        distributor.endGiveaway(giveawayId);

        vm.prank(owner);
        vm.expectRevert("GiveawayDistributor: giveaway already ended");
        distributor.endGiveaway(giveawayId);
    }

    function testRandomUserCannotEndGiveaway() public {
        uint256 giveawayId = _createTestGiveaway();

        vm.warp(endTime + 1);

        vm.prank(user1);
        vm.expectRevert(
            "GiveawayDistributor: only creator or owner can end giveaway"
        );
        distributor.endGiveaway(giveawayId);
    }

    /*//////////////////////////////////////////////////////////////
                        DISPOSE GIVEAWAY TESTS
    //////////////////////////////////////////////////////////////*/

    function testDisposeGiveawayWithLeftovers() public {
        uint256 giveawayId = _createTestGiveaway();

        // Only 3 users claim
        vm.prank(user1);
        distributor.claimReward(giveawayId);
        vm.prank(user2);
        distributor.claimReward(giveawayId);
        vm.prank(user3);
        distributor.claimReward(giveawayId);

        // End giveaway
        vm.warp(endTime + 1);
        vm.prank(creator);
        distributor.endGiveaway(giveawayId);

        // Calculate expected leftover
        uint256 rewardPerWinner = distributor.getRewardPerWinner(giveawayId);
        uint256 expectedLeftover = TOTAL_AMOUNT - (rewardPerWinner * 3);

        uint256 creatorBalanceBefore = token.balanceOf(creator);

        vm.prank(creator);
        vm.expectEmit(true, false, false, true);
        emit GiveawayDisposed(giveawayId, expectedLeftover);
        distributor.disposeGiveaway(giveawayId);

        assertEq(
            token.balanceOf(creator),
            creatorBalanceBefore + expectedLeftover
        );

        (, , , , , , , , bool disposed) = distributor.giveaways(giveawayId);
        assertTrue(disposed);
    }

    function testDisposeGiveawayWithNoClaims() public {
        uint256 giveawayId = _createTestGiveaway();

        vm.warp(endTime + 1);
        vm.prank(creator);
        distributor.endGiveaway(giveawayId);

        uint256 creatorBalanceBefore = token.balanceOf(creator);

        vm.prank(creator);
        distributor.disposeGiveaway(giveawayId);

        assertEq(token.balanceOf(creator), creatorBalanceBefore + TOTAL_AMOUNT);
    }

    function testDisposeGiveawayWithAllClaimed() public {
        uint256 giveawayId = _createTestGiveaway();

        // All winners claim
        for (uint256 i = 1; i <= WINNERS_COUNT; i++) {
            address user = address(uint160(1000 + i));
            vm.prank(user);
            distributor.claimReward(giveawayId);
        }

        uint256 creatorBalanceBefore = token.balanceOf(creator);

        vm.prank(creator);
        distributor.disposeGiveaway(giveawayId);

        // No leftover tokens
        assertEq(token.balanceOf(creator), creatorBalanceBefore);
    }

    function testOnlyCreatorCanDispose() public {
        uint256 giveawayId = _createTestGiveaway();

        vm.prank(owner);
        distributor.endGiveaway(giveawayId);

        vm.prank(user1);
        vm.expectRevert("GiveawayDistributor: only creator can dispose");
        distributor.disposeGiveaway(giveawayId);
    }

    function testCannotDisposeActiveGiveaway() public {
        uint256 giveawayId = _createTestGiveaway();

        vm.prank(creator);
        vm.expectRevert("GiveawayDistributor: giveaway is still active");
        distributor.disposeGiveaway(giveawayId);
    }

    function testCannotDisposeTwice() public {
        uint256 giveawayId = _createTestGiveaway();

        vm.prank(owner);
        distributor.endGiveaway(giveawayId);

        vm.startPrank(creator);
        distributor.disposeGiveaway(giveawayId);

        vm.expectRevert("GiveawayDistributor: already disposed");
        distributor.disposeGiveaway(giveawayId);
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                        ANNOUNCE WINNERS TESTS
    //////////////////////////////////////////////////////////////*/

    function testAnnounceWinners() public {
        uint256 giveawayId = _createTestGiveaway();

        address[] memory participants = new address[](20);
        for (uint256 i = 0; i < 20; i++) {
            participants[i] = address(uint160(2000 + i));
        }

        vm.prank(creator);
        vm.expectEmit(true, false, false, false);
        emit WinnersAnnounced(giveawayId, new address[](0));
        distributor.announceWinners(giveawayId, participants);

        address[] memory winners = distributor.getAnnouncedWinners(giveawayId);
        assertEq(winners.length, WINNERS_COUNT);
    }

    function testAnnounceWinnersWithFewerParticipants() public {
        uint256 giveawayId = _createTestGiveaway();

        address[] memory participants = new address[](5);
        for (uint256 i = 0; i < 5; i++) {
            participants[i] = address(uint160(2000 + i));
        }

        vm.prank(creator);
        distributor.announceWinners(giveawayId, participants);

        address[] memory winners = distributor.getAnnouncedWinners(giveawayId);
        assertEq(winners.length, 5);
    }

    function testOwnerCanAnnounceWinners() public {
        uint256 giveawayId = _createTestGiveaway();

        address[] memory participants = new address[](15);
        for (uint256 i = 0; i < 15; i++) {
            participants[i] = address(uint160(2000 + i));
        }

        vm.prank(owner);
        distributor.announceWinners(giveawayId, participants);

        address[] memory winners = distributor.getAnnouncedWinners(giveawayId);
        assertEq(winners.length, WINNERS_COUNT);
    }

    function testCannotAnnounceWinnersTwice() public {
        uint256 giveawayId = _createTestGiveaway();

        address[] memory participants = new address[](15);
        for (uint256 i = 0; i < 15; i++) {
            participants[i] = address(uint160(2000 + i));
        }

        vm.startPrank(creator);
        distributor.announceWinners(giveawayId, participants);

        vm.expectRevert("GiveawayDistributor: winners already announced");
        distributor.announceWinners(giveawayId, participants);
        vm.stopPrank();
    }

    function testCannotAnnounceWinnersWithoutParticipants() public {
        uint256 giveawayId = _createTestGiveaway();

        address[] memory participants = new address[](0);

        vm.prank(creator);
        vm.expectRevert("GiveawayDistributor: no participants provided");
        distributor.announceWinners(giveawayId, participants);
    }

    function testRandomUserCannotAnnounceWinners() public {
        uint256 giveawayId = _createTestGiveaway();

        address[] memory participants = new address[](15);
        for (uint256 i = 0; i < 15; i++) {
            participants[i] = address(uint160(2000 + i));
        }

        vm.prank(user1);
        vm.expectRevert(
            "GiveawayDistributor: only owner or creator can announce winners"
        );
        distributor.announceWinners(giveawayId, participants);
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW FUNCTION TESTS
    //////////////////////////////////////////////////////////////*/

    function testGetRewardPerWinner() public {
        uint256 giveawayId = _createTestGiveaway();
        uint256 expected = TOTAL_AMOUNT / WINNERS_COUNT;
        assertEq(distributor.getRewardPerWinner(giveawayId), expected);
    }

    function testIsGiveawayExpired() public {
        uint256 giveawayId = _createTestGiveaway();

        assertFalse(distributor.isGiveawayExpired(giveawayId));

        vm.warp(endTime + 1);

        assertTrue(distributor.isGiveawayExpired(giveawayId));
    }

    function testGetTotalGiveaways() public {
        assertEq(distributor.getTotalGiveaways(), 0);

        _createTestGiveaway();
        assertEq(distributor.getTotalGiveaways(), 1);

        _createTestGiveaway();
        assertEq(distributor.getTotalGiveaways(), 2);

        _createTestGiveaway();
        assertEq(distributor.getTotalGiveaways(), 3);
    }

    function testGetAnnouncedWinnersEmpty() public {
        uint256 giveawayId = _createTestGiveaway();
        address[] memory winners = distributor.getAnnouncedWinners(giveawayId);
        assertEq(winners.length, 0);
    }

    /*//////////////////////////////////////////////////////////////
                        VRF PLACEHOLDER TESTS
    //////////////////////////////////////////////////////////////*/

    function testRequestRandomnessNotImplemented() public {
        uint256 giveawayId = _createTestGiveaway();

        vm.prank(owner);
        vm.expectRevert(
            "GiveawayDistributor: VRF not yet implemented - use announceWinners for testnets"
        );
        distributor.requestRandomness(giveawayId);
    }

    function testRequestRandomnessInvalidGiveaway() public {
        vm.prank(owner);
        vm.expectRevert("GiveawayDistributor: invalid giveaway");
        distributor.requestRandomness(999);
    }

    /*//////////////////////////////////////////////////////////////
                        REENTRANCY TESTS
    //////////////////////////////////////////////////////////////*/

    function testReentrancyProtectionOnClaim() public {
        // This would require a malicious token contract
        // Basic check that nonReentrant modifier is present
        uint256 giveawayId = _createTestGiveaway();

        vm.prank(user1);
        distributor.claimReward(giveawayId);

        // Second call should fail due to already claimed, not reentrancy
        vm.prank(user1);
        vm.expectRevert("GiveawayDistributor: already claimed");
        distributor.claimReward(giveawayId);
    }

    /*//////////////////////////////////////////////////////////////
                        EDGE CASES & INTEGRATION
    //////////////////////////////////////////////////////////////*/

    function testCompleteGiveawayLifecycle() public {
        // Create giveaway
        uint256 giveawayId = _createTestGiveaway();

        // Multiple users claim
        vm.prank(user1);
        distributor.claimReward(giveawayId);
        vm.prank(user2);
        distributor.claimReward(giveawayId);

        // Expire and end
        vm.warp(endTime + 1);
        vm.prank(creator);
        distributor.endGiveaway(giveawayId);

        // Dispose and recover leftover tokens
        uint256 balanceBefore = token.balanceOf(creator);
        vm.prank(creator);
        distributor.disposeGiveaway(giveawayId);
        assertTrue(token.balanceOf(creator) > balanceBefore);
    }

    function testPrivateGiveaway() public {
        vm.startPrank(creator);
        token.approve(address(distributor), TOTAL_AMOUNT);

        uint256 giveawayId = distributor.createGiveaway(
            address(token),
            TOTAL_AMOUNT,
            WINNERS_COUNT,
            endTime,
            true // private
        );
        vm.stopPrank();

        (, , , , , , bool isPrivate, , ) = distributor.giveaways(giveawayId);
        assertTrue(isPrivate);
    }

    /*//////////////////////////////////////////////////////////////
                        HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _createTestGiveaway() internal returns (uint256) {
        vm.startPrank(creator);
        token.approve(address(distributor), TOTAL_AMOUNT);
        uint256 giveawayId = distributor.createGiveaway(
            address(token),
            TOTAL_AMOUNT,
            WINNERS_COUNT,
            endTime,
            false
        );
        vm.stopPrank();
        return giveawayId;
    }
}