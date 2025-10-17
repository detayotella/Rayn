// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/GiveawayDistributor.sol";
import "../src/RaynStable.sol";

contract GiveawayDistributorTest is Test {
    GiveawayDistributor public giveaway;
    RaynStable public token;
    
    address creator;
    address user1;
    address user2;
    address user3;
    
    uint256 endTime;

    function setUp() public {
        creator = address(this);
        user1 = address(0x1111);
        user2 = address(0x2222);
        user3 = address(0x3333);
        
        giveaway = new GiveawayDistributor();
        token = new RaynStable();
        
        // Mint tokens for tests
        token.mint(creator, 10_000 * 10**6);
        
        endTime = block.timestamp + 7 days;
    }

    // ============================================
    // DEPLOYMENT TESTS
    // ============================================

    function test_DeploymentOwner() public view {
        assertEq(giveaway.owner(), creator);
    }

    function test_InitialGiveawayIdIsOne() public view {
        assertEq(giveaway.getTotalGiveaways(), 0);
    }

    // ============================================
    // GIVEAWAY CREATION TESTS
    // ============================================

    function test_CanCreatePublicGiveaway() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        assertEq(giveawayId, 1);
        assertEq(giveaway.getTotalGiveaways(), 1);
    }

    function test_CanCreatePrivateGiveaway() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            true
        );
        
        assertEq(giveawayId, 1);
    }

    function test_CreationEmitsEvent() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        
        vm.expectEmit(true, true, true, true);
        emit GiveawayDistributor.GiveawayCreated(
            1,
            creator,
            address(token),
            totalAmount,
            winnersCount,
            endTime
        );
        
        giveaway.createGiveaway(address(token), totalAmount, winnersCount, endTime, false);
    }

    function test_CannotCreateWithZeroWinners() public {
        uint256 totalAmount = 1000 * 10**6;
        
        token.approve(address(giveaway), totalAmount);
        
        vm.expectRevert("GiveawayDistributor: must have at least one winner");
        giveaway.createGiveaway(address(token), totalAmount, 0, endTime, false);
    }

    function test_CannotCreateWithZeroAmount() public {
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), 0);
        
        vm.expectRevert("GiveawayDistributor: total amount must be greater than zero");
        giveaway.createGiveaway(address(token), 0, winnersCount, endTime, false);
    }

    function test_CannotCreateWithPastEndTime() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        uint256 pastTime = block.timestamp - 1 days;
        
        token.approve(address(giveaway), totalAmount);
        
        vm.expectRevert("GiveawayDistributor: end time must be in the future");
        giveaway.createGiveaway(address(token), totalAmount, winnersCount, pastTime, false);
    }

    function test_CannotCreateWithAmountTooSmall() public {
        uint256 totalAmount = 5 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        
        vm.expectRevert("GiveawayDistributor: total amount too small for winner count");
        giveaway.createGiveaway(address(token), totalAmount, winnersCount, endTime, false);
    }

    function test_CannotCreateWithInvalidToken() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        vm.expectRevert("GiveawayDistributor: invalid token address");
        giveaway.createGiveaway(address(0), totalAmount, winnersCount, endTime, false);
    }

    function test_MultipleGiveawaysCanBeCreated() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount * 3);
        
        uint256 id1 = giveaway.createGiveaway(address(token), totalAmount, winnersCount, endTime, false);
        uint256 id2 = giveaway.createGiveaway(address(token), totalAmount, winnersCount, endTime, false);
        uint256 id3 = giveaway.createGiveaway(address(token), totalAmount, winnersCount, endTime, false);
        
        assertEq(id1, 1);
        assertEq(id2, 2);
        assertEq(id3, 3);
        assertEq(giveaway.getTotalGiveaways(), 3);
    }

    // ============================================
    // CLAIMING TESTS
    // ============================================

    function test_UserCanClaimReward() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        uint256 expectedReward = totalAmount / winnersCount;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.prank(user1);
        giveaway.claimReward(giveawayId);
        
        assertEq(token.balanceOf(user1), expectedReward);
    }

    function test_ClaimingEmitsEvent() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        uint256 expectedReward = totalAmount / winnersCount;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.prank(user1);
        vm.expectEmit(true, true, false, true);
        emit GiveawayDistributor.RewardClaimed(giveawayId, user1, expectedReward);
        giveaway.claimReward(giveawayId);
    }

    function test_CannotClaimTwice() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.prank(user1);
        giveaway.claimReward(giveawayId);
        
        vm.prank(user1);
        vm.expectRevert("GiveawayDistributor: already claimed");
        giveaway.claimReward(giveawayId);
    }

    function test_CannotClaimExpiredGiveaway() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.warp(endTime + 1);
        
        vm.prank(user1);
        vm.expectRevert("GiveawayDistributor: giveaway has expired");
        giveaway.claimReward(giveawayId);
    }

    function test_CannotClaimWhenInactive() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        giveaway.endGiveaway(giveawayId);
        
        vm.prank(user1);
        vm.expectRevert("GiveawayDistributor: giveaway is not active");
        giveaway.claimReward(giveawayId);
    }

    function test_CannotClaimWhenAllClaimedRewards() public {
        uint256 totalAmount = 100 * 10**6;
        uint256 winnersCount = 2;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.prank(user1);
        giveaway.claimReward(giveawayId);
        
        vm.prank(user2);
        giveaway.claimReward(giveawayId);
        
        vm.prank(user3);
        vm.expectRevert("GiveawayDistributor: all rewards claimed");
        giveaway.claimReward(giveawayId);
    }

    function test_GiveawayAutomaticallyEndsWhenFullyClaimedRewards() public {
        uint256 totalAmount = 100 * 10**6;
        uint256 winnersCount = 2;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.prank(user1);
        giveaway.claimReward(giveawayId);
        
        vm.prank(user2);
        vm.expectEmit(true, false, false, true);
        emit GiveawayDistributor.GiveawayEnded(giveawayId, false);
        giveaway.claimReward(giveawayId);
    }

    function test_MultipleUsersCanClaimRewards() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        uint256 expectedReward = totalAmount / winnersCount;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.prank(user1);
        giveaway.claimReward(giveawayId);
        
        vm.prank(user2);
        giveaway.claimReward(giveawayId);
        
        assertEq(token.balanceOf(user1), expectedReward);
        assertEq(token.balanceOf(user2), expectedReward);
    }

    // ============================================
    // END GIVEAWAY TESTS
    // ============================================

    function test_CreatorCanEndGiveaway() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.warp(endTime + 1);
        giveaway.endGiveaway(giveawayId);
        
        // Verify giveaway is ended
        vm.prank(user1);
        vm.expectRevert("GiveawayDistributor: giveaway is not active");
        giveaway.claimReward(giveawayId);
    }

    function test_EndingEmitsEvent() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.warp(endTime + 1);
        
        vm.expectEmit(true, false, false, true);
        emit GiveawayDistributor.GiveawayEnded(giveawayId, true);
        giveaway.endGiveaway(giveawayId);
    }

    function test_CannotEndBeforeExpiration() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.expectRevert("GiveawayDistributor: giveaway has not expired yet");
        giveaway.endGiveaway(giveawayId);
    }

    function test_OwnerCanEndGiveawayEarly() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        // Owner can end without expiration
        giveaway.endGiveaway(giveawayId);
    }

    function test_NonCreatorCannotEndGiveaway() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.warp(endTime + 1);
        
        vm.prank(user1);
        vm.expectRevert("GiveawayDistributor: only creator or owner can end giveaway");
        giveaway.endGiveaway(giveawayId);
    }

    // ============================================
    // DISPOSE GIVEAWAY TESTS
    // ============================================

    function test_CreatorCanDisposeGiveaway() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        // Claim some rewards
        vm.prank(user1);
        giveaway.claimReward(giveawayId);
        
        // End giveaway
        vm.warp(endTime + 1);
        giveaway.endGiveaway(giveawayId);
        
        uint256 creatorBalanceBefore = token.balanceOf(creator);
        giveaway.disposeGiveaway(giveawayId);
        
        // Should get back unclaimed tokens
        assertGt(token.balanceOf(creator), creatorBalanceBefore);
    }

    function test_DisposeEmitsEvent() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.warp(endTime + 1);
        giveaway.endGiveaway(giveawayId);
        
        uint256 expectedLeftover = totalAmount; // Nothing claimed
        
        vm.expectEmit(true, false, false, true);
        emit GiveawayDistributor.GiveawayDisposed(giveawayId, expectedLeftover);
        giveaway.disposeGiveaway(giveawayId);
    }

    function test_CannotDisposeIfStillActive() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.expectRevert("GiveawayDistributor: giveaway is still active");
        giveaway.disposeGiveaway(giveawayId);
    }

    function test_CannotDisposeTwice() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.warp(endTime + 1);
        giveaway.endGiveaway(giveawayId);
        giveaway.disposeGiveaway(giveawayId);
        
        vm.expectRevert("GiveawayDistributor: already disposed");
        giveaway.disposeGiveaway(giveawayId);
    }

    function test_NonCreatorCannotDispose() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        vm.warp(endTime + 1);
        giveaway.endGiveaway(giveawayId);
        
        vm.prank(user1);
        vm.expectRevert("GiveawayDistributor: only creator can dispose");
        giveaway.disposeGiveaway(giveawayId);
    }

    // ============================================
    // HELPER FUNCTION TESTS
    // ============================================

    function test_GetRewardPerWinner() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        uint256 expectedReward = totalAmount / winnersCount;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        assertEq(giveaway.getRewardPerWinner(giveawayId), expectedReward);
    }

    function test_IsGiveawayExpired() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        assertFalse(giveaway.isGiveawayExpired(giveawayId));
        
        vm.warp(endTime + 1);
        
        assertTrue(giveaway.isGiveawayExpired(giveawayId));
    }

    function test_GetTotalGiveaways() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        assertEq(giveaway.getTotalGiveaways(), 0);
        
        token.approve(address(giveaway), totalAmount);
        giveaway.createGiveaway(address(token), totalAmount, winnersCount, endTime, false);
        
        assertEq(giveaway.getTotalGiveaways(), 1);
        
        token.approve(address(giveaway), totalAmount);
        giveaway.createGiveaway(address(token), totalAmount, winnersCount, endTime, false);
        
        assertEq(giveaway.getTotalGiveaways(), 2);
    }

    // ============================================
    // ANNOUNCE WINNERS TESTS
    // ============================================

    function test_CreatorCanAnnounceWinners() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 3;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        address[] memory participants = new address[](5);
        participants[0] = user1;
        participants[1] = user2;
        participants[2] = user3;
        participants[3] = address(0x4444);
        participants[4] = address(0x5555);
        
        giveaway.announceWinners(giveawayId, participants);
        
        address[] memory winners = giveaway.getAnnouncedWinners(giveawayId);
        assertEq(winners.length, winnersCount);
    }

    function test_AnnounceWinnersEmitsEvent() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 3;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        address[] memory participants = new address[](5);
        participants[0] = user1;
        participants[1] = user2;
        participants[2] = user3;
        participants[3] = address(0x4444);
        participants[4] = address(0x5555);
        
        vm.expectEmit(true, false, false, false);
        emit GiveawayDistributor.WinnersAnnounced(giveawayId, participants);
        
        giveaway.announceWinners(giveawayId, participants);
    }

    function test_CannotAnnounceWinnersEmptyParticipants() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 10;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        address[] memory participants = new address[](0);
        
        vm.expectRevert("GiveawayDistributor: no participants provided");
        giveaway.announceWinners(giveawayId, participants);
    }

    function test_CannotAnnounceWinnersTwice() public {
        uint256 totalAmount = 1000 * 10**6;
        uint256 winnersCount = 3;
        
        token.approve(address(giveaway), totalAmount);
        uint256 giveawayId = giveaway.createGiveaway(
            address(token),
            totalAmount,
            winnersCount,
            endTime,
            false
        );
        
        address[] memory participants = new address[](5);
        participants[0] = user1;
        participants[1] = user2;
        participants[2] = user3;
        participants[3] = address(0x4444);
        participants[4] = address(0x5555);
        
        giveaway.announceWinners(giveawayId, participants);
        
        vm.expectRevert("GiveawayDistributor: winners already announced");
        giveaway.announceWinners(giveawayId, participants);
    }
}