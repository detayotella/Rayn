// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/RaynStable.sol";

contract RaynStableTest is Test {
    RaynStable public raynStable;
    address owner;
    address user1;
    address user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1111);
        user2 = address(0x2222);
        
        raynStable = new RaynStable();
    }

    // ============================================
    // DEPLOYMENT TESTS
    // ============================================

    function test_DeploymentNameAndSymbol() public view {
        assertEq(raynStable.name(), "Rayn Stable");
        assertEq(raynStable.symbol(), "RAYNS");
    }

    function test_DeploymentDecimals() public view {
        assertEq(raynStable.decimals(), 6);
    }

    function test_DeploymentOwner() public view {
        assertEq(raynStable.owner(), owner);
    }

    function test_DeploymentInitialSupply() public view {
        assertEq(raynStable.totalSupply(), 0);
    }

    // ============================================
    // MINTING TESTS
    // ============================================

    function test_OwnerCanMint() public {
        uint256 amount = 100 * 10**6; // 100 RAYNS
        raynStable.mint(user1, amount);
        
        assertEq(raynStable.balanceOf(user1), amount);
        assertEq(raynStable.totalSupply(), amount);
    }

    function test_MintEmitsEvent() public {
        uint256 amount = 50 * 10**6;
        vm.expectEmit(true, false, false, true);
        emit RaynStable.TokensMinted(user1, amount);
        
        raynStable.mint(user1, amount);
    }

    function test_NonOwnerCannotMint() public {
        uint256 amount = 100 * 10**6;
        vm.prank(user1);
        vm.expectRevert();
        raynStable.mint(user1, amount);
    }

    function test_CannotMintToZeroAddress() public {
        uint256 amount = 100 * 10**6;
        vm.expectRevert("RaynStable: cannot mint to zero address");
        raynStable.mint(address(0), amount);
    }

    function test_CannotMintZeroAmount() public {
        vm.expectRevert("RaynStable: amount must be greater than zero");
        raynStable.mint(user1, 0);
    }

    function test_MultipleMints() public {
        uint256 amount1 = 100 * 10**6;
        uint256 amount2 = 50 * 10**6;
        
        raynStable.mint(user1, amount1);
        raynStable.mint(user1, amount2);
        
        assertEq(raynStable.balanceOf(user1), amount1 + amount2);
        assertEq(raynStable.totalSupply(), amount1 + amount2);
    }

    function test_MintToMultipleUsers() public {
        uint256 amount = 100 * 10**6;
        
        raynStable.mint(user1, amount);
        raynStable.mint(user2, amount);
        
        assertEq(raynStable.balanceOf(user1), amount);
        assertEq(raynStable.balanceOf(user2), amount);
        assertEq(raynStable.totalSupply(), amount * 2);
    }

    // ============================================
    // MINT TO SELF TESTS
    // ============================================

    function test_OwnerCanMintToSelf() public {
        uint256 amount = 1000 * 10**6;
        raynStable.mintToSelf(amount);
        
        assertEq(raynStable.balanceOf(owner), amount);
    }

    function test_MintToSelfEmitsEvent() public {
        uint256 amount = 500 * 10**6;
        vm.expectEmit(true, false, false, true);
        emit RaynStable.TokensMinted(owner, amount);
        
        raynStable.mintToSelf(amount);
    }

    function test_NonOwnerCannotMintToSelf() public {
        uint256 amount = 100 * 10**6;
        vm.prank(user1);
        vm.expectRevert();
        raynStable.mintToSelf(amount);
    }

    // ============================================
    // ERC20 TRANSFER TESTS
    // ============================================

    function test_TransferTokens() public {
        uint256 amount = 100 * 10**6;
        raynStable.mint(owner, 1000 * 10**6);
        
        raynStable.transfer(user1, amount);
        
        assertEq(raynStable.balanceOf(user1), amount);
        assertEq(raynStable.balanceOf(owner), 900 * 10**6);
    }

    function test_CannotTransferMoreThanBalance() public {
        uint256 amount = 2000 * 10**6;
        raynStable.mint(owner, 1000 * 10**6);
        
        vm.expectRevert();
        raynStable.transfer(user1, amount);
    }

    function test_ApproveTokens() public {
        uint256 amount = 500 * 10**6;
        raynStable.approve(user1, amount);
        
        assertEq(raynStable.allowance(owner, user1), amount);
    }

    function test_TransferFromAfterApproval() public {
        uint256 amount = 300 * 10**6;
        raynStable.mint(owner, 1000 * 10**6);
        raynStable.approve(user1, amount);
        
        vm.prank(user1);
        raynStable.transferFrom(owner, user2, amount);
        
        assertEq(raynStable.balanceOf(user2), amount);
        assertEq(raynStable.allowance(owner, user1), 0);
    }

    function test_CannotTransferFromMoreThanAllowance() public {
        uint256 approved = 100 * 10**6;
        uint256 toTransfer = 200 * 10**6;
        
        raynStable.mint(owner, 1000 * 10**6);
        raynStable.approve(user1, approved);
        
        vm.prank(user1);
        vm.expectRevert();
        raynStable.transferFrom(owner, user2, toTransfer);
    }

    // ============================================
    // OWNERSHIP TESTS
    // ============================================

    function test_TransferOwnership() public {
        raynStable.transferOwnership(user1);
        assertEq(raynStable.owner(), user1);
    }

    function test_NonOwnerCannotTransferOwnership() public {
        vm.prank(user1);
        vm.expectRevert();
        raynStable.transferOwnership(user2);
    }

    function test_NewOwnerCanMint() public {
        raynStable.transferOwnership(user1);
        uint256 amount = 100 * 10**6;
        
        vm.prank(user1);
        raynStable.mint(user2, amount);
        
        assertEq(raynStable.balanceOf(user2), amount);
    }

    // ============================================
    // EDGE CASES
    // ============================================

    function test_MintLargeAmount() public {
        uint256 largeAmount = 1_000_000_000 * 10**6; // 1 billion tokens
        raynStable.mint(user1, largeAmount);
        
        assertEq(raynStable.balanceOf(user1), largeAmount);
    }

    function test_MultipleTransfers() public {
        raynStable.mint(user1, 1000 * 10**6);
        
        vm.prank(user1);
        raynStable.transfer(user2, 300 * 10**6);
        
        vm.prank(user2);
        raynStable.transfer(owner, 100 * 10**6);
        
        assertEq(raynStable.balanceOf(user2), 200 * 10**6);
        assertEq(raynStable.balanceOf(owner), 100 * 10**6);
    }

    function test_ApprovalAndTransferFrom() public {
        uint256 amount = 500 * 10**6;
        raynStable.mint(owner, 1000 * 10**6);
        
        raynStable.approve(user1, amount);
        
        vm.prank(user1);
        raynStable.transferFrom(owner, user2, 200 * 10**6);
        
        assertEq(raynStable.balanceOf(user2), 200 * 10**6);
        assertEq(raynStable.allowance(owner, user1), 300 * 10**6);
    }

    function test_TransferToMultipleAddresses() public {
        uint256 amountPerUser = 100 * 10**6;
        raynStable.mint(owner, 1000 * 10**6);
        
        raynStable.transfer(user1, amountPerUser);
        raynStable.transfer(user2, amountPerUser);
        
        assertEq(raynStable.balanceOf(user1), amountPerUser);
        assertEq(raynStable.balanceOf(user2), amountPerUser);
        assertEq(raynStable.totalSupply(), 1000 * 10**6);
    }
}