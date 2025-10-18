// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/UsernameRegistry.sol";

contract UsernameRegistryTest is Test {
    UsernameRegistry public registry;
    
    address public owner;
    address public alice;
    address public bob;
    address public charlie;
    
    event UsernameRegistered(address indexed user, string username);
    event UsernameUpdated(address indexed user, string oldUsername, string newUsername);
    event UsernameDeleted(address indexed user, string username);
    
    function setUp() public {
        owner = address(this);
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        charlie = makeAddr("charlie");
        
        registry = new UsernameRegistry();
    }
    
    /*//////////////////////////////////////////////////////////////
                        REGISTRATION TESTS
    //////////////////////////////////////////////////////////////*/
    
    function testRegisterUsername() public {
        vm.prank(alice);
        vm.expectEmit(true, false, false, true);
        emit UsernameRegistered(alice, "alice_crypto");
        registry.registerUsername("alice_crypto");
        
        assertEq(registry.resolveUsername("alice_crypto"), alice);
        assertEq(registry.getUsernameOf(alice), "alice_crypto");
    }
    
    function testRegisterMultipleUsers() public {
        vm.prank(alice);
        registry.registerUsername("alice_crypto");
        
        vm.prank(bob);
        registry.registerUsername("bob_wallet");
        
        vm.prank(charlie);
        registry.registerUsername("charlie123");
        
        assertEq(registry.resolveUsername("alice_crypto"), alice);
        assertEq(registry.resolveUsername("bob_wallet"), bob);
        assertEq(registry.resolveUsername("charlie123"), charlie);
    }
    
    function testCannotRegisterDuplicateUsername() public {
        vm.prank(alice);
        registry.registerUsername("alice_crypto");
        
        vm.prank(bob);
        vm.expectRevert("UsernameRegistry: username already taken");
        registry.registerUsername("alice_crypto");
    }
    
    function testCannotRegisterTwice() public {
        vm.prank(alice);
        registry.registerUsername("alice_crypto");
        
        vm.prank(alice);
        vm.expectRevert("UsernameRegistry: caller already has a username");
        registry.registerUsername("alice_new");
    }
    
    /*//////////////////////////////////////////////////////////////
                        VALIDATION TESTS
    //////////////////////////////////////////////////////////////*/
    
    function testMinimumLength() public {
        vm.prank(alice);
        registry.registerUsername("abc");
        assertEq(registry.getUsernameOf(alice), "abc");
    }
    
    function testCannotRegisterTooShort() public {
        vm.prank(alice);
        vm.expectRevert("UsernameRegistry: invalid username format");
        registry.registerUsername("ab");
    }
    
    function testMaximumLength() public {
        vm.prank(alice);
        registry.registerUsername("abcdefghij1234567890"); // 20 characters
        assertEq(registry.getUsernameOf(alice), "abcdefghij1234567890");
    }
    
    function testCannotRegisterTooLong() public {
        vm.prank(alice);
        vm.expectRevert("UsernameRegistry: invalid username format");
        registry.registerUsername("abcdefghij12345678901"); // 21 characters
    }
    
    function testValidCharacters() public {
        vm.prank(alice);
        registry.registerUsername("user_name_123");
        assertEq(registry.getUsernameOf(alice), "user_name_123");
    }
    
    function testCannotStartWithUnderscore() public {
        vm.prank(alice);
        vm.expectRevert("UsernameRegistry: invalid username format");
        registry.registerUsername("_username");
    }
    
    function testCannotEndWithUnderscore() public {
        vm.prank(alice);
        vm.expectRevert("UsernameRegistry: invalid username format");
        registry.registerUsername("username_");
    }
    
    function testCannotHaveUppercase() public {
        vm.prank(alice);
        vm.expectRevert("UsernameRegistry: invalid username format");
        registry.registerUsername("Alice");
    }
    
    function testCannotHaveSpecialCharacters() public {
        vm.prank(alice);
        vm.expectRevert("UsernameRegistry: invalid username format");
        registry.registerUsername("alice@crypto");
    }
    
    function testCannotHaveSpaces() public {
        vm.prank(alice);
        vm.expectRevert("UsernameRegistry: invalid username format");
        registry.registerUsername("alice crypto");
    }
    
    /*//////////////////////////////////////////////////////////////
                        UPDATE TESTS
    //////////////////////////////////////////////////////////////*/
    
    function testUpdateUsername() public {
        vm.startPrank(alice);
        registry.registerUsername("alice_old");
        
        vm.expectEmit(true, false, false, true);
        emit UsernameUpdated(alice, "alice_old", "alice_new");
        registry.updateUsername("alice_new");
        vm.stopPrank();
        
        assertEq(registry.resolveUsername("alice_new"), alice);
        assertEq(registry.getUsernameOf(alice), "alice_new");
        assertEq(registry.resolveUsername("alice_old"), address(0));
    }
    
    function testCannotUpdateWithoutUsername() public {
        vm.prank(alice);
        vm.expectRevert("UsernameRegistry: caller has no username to update");
        registry.updateUsername("alice_new");
    }
    
    function testCannotUpdateToTakenUsername() public {
        vm.prank(alice);
        registry.registerUsername("alice_crypto");
        
        vm.prank(bob);
        registry.registerUsername("bob_wallet");
        
        vm.prank(alice);
        vm.expectRevert("UsernameRegistry: new username already taken");
        registry.updateUsername("bob_wallet");
    }
    
    function testCannotUpdateToInvalidUsername() public {
        vm.startPrank(alice);
        registry.registerUsername("alice_crypto");
        
        vm.expectRevert("UsernameRegistry: invalid username format");
        registry.updateUsername("AB");
        vm.stopPrank();
    }
    
    /*//////////////////////////////////////////////////////////////
                        DELETE TESTS
    //////////////////////////////////////////////////////////////*/
    
    function testDeleteUsername() public {
        vm.startPrank(alice);
        registry.registerUsername("alice_crypto");
        
        vm.expectEmit(true, false, false, true);
        emit UsernameDeleted(alice, "alice_crypto");
        registry.deleteUsername();
        vm.stopPrank();
        
        assertEq(registry.resolveUsername("alice_crypto"), address(0));
        assertEq(registry.getUsernameOf(alice), "");
    }
    
    function testCannotDeleteWithoutUsername() public {
        vm.prank(alice);
        vm.expectRevert("UsernameRegistry: caller has no username to delete");
        registry.deleteUsername();
    }
    
    function testCanReregisterAfterDelete() public {
        vm.startPrank(alice);
        registry.registerUsername("alice_crypto");
        registry.deleteUsername();
        registry.registerUsername("alice_new");
        vm.stopPrank();
        
        assertEq(registry.getUsernameOf(alice), "alice_new");
    }
    
    function testOtherUserCanRegisterDeletedUsername() public {
        vm.prank(alice);
        registry.registerUsername("alice_crypto");
        
        vm.prank(alice);
        registry.deleteUsername();
        
        vm.prank(bob);
        registry.registerUsername("alice_crypto");
        
        assertEq(registry.resolveUsername("alice_crypto"), bob);
    }
    
    /*//////////////////////////////////////////////////////////////
                        VIEW FUNCTION TESTS
    //////////////////////////////////////////////////////////////*/
    
    function testResolveNonexistentUsername() public {
        assertEq(registry.resolveUsername("nonexistent"), address(0));
    }
    
    function testGetUsernameOfUnregisteredAddress() public {
        assertEq(registry.getUsernameOf(alice), "");
    }
    
    function testIsUsernameAvailable() public {
        assertTrue(registry.isUsernameAvailable("available_name"));
        
        vm.prank(alice);
        registry.registerUsername("taken_name");
        
        assertFalse(registry.isUsernameAvailable("taken_name"));
    }
    
    function testIsUsernameAvailableInvalidFormat() public {
        assertFalse(registry.isUsernameAvailable("AB")); // Too short
        assertFalse(registry.isUsernameAvailable("_username")); // Starts with underscore
        assertFalse(registry.isUsernameAvailable("Username")); // Uppercase
    }
    
    /*//////////////////////////////////////////////////////////////
                        CONSTANTS TESTS
    //////////////////////////////////////////////////////////////*/
    
    function testConstants() public {
        assertEq(registry.MIN_USERNAME_LENGTH(), 3);
        assertEq(registry.MAX_USERNAME_LENGTH(), 20);
    }
    
    /*//////////////////////////////////////////////////////////////
                        FUZZ TESTS
    //////////////////////////////////////////////////////////////*/

    function testFuzzRegisterValidUsername(uint256 seed) public {
        // Generate a valid username from seed
        bytes memory username = new bytes(10); // Fixed length of 10
        
        for (uint256 i = 0; i < 10; i++) {
            uint256 charType = uint256(keccak256(abi.encodePacked(seed, i))) % 37;
            
            if (charType < 26) {
                // a-z
                username[i] = bytes1(uint8(97 + charType));
            } else if (charType < 36) {
                // 0-9
                username[i] = bytes1(uint8(48 + (charType - 26)));
            } else {
                // underscore (only in middle positions)
                if (i > 0 && i < 9) {
                    username[i] = "_";
                } else {
                    username[i] = "a"; // fallback for first/last position
                }
            }
        }
        
        string memory usernameStr = string(username);
        
        vm.prank(alice);
        registry.registerUsername(usernameStr);
        
        assertEq(registry.resolveUsername(usernameStr), alice);
        assertEq(registry.getUsernameOf(alice), usernameStr);
    }

    function testFuzzUsernameLength(uint8 length) public {
        // Test different valid lengths (3-20)
        vm.assume(length >= 3 && length <= 20);
        
        bytes memory username = new bytes(length);
        for (uint256 i = 0; i < length; i++) {
            username[i] = "a"; // Simple valid username
        }
        
        string memory usernameStr = string(username);
        
        vm.prank(alice);
        registry.registerUsername(usernameStr);
        
        assertEq(registry.getUsernameOf(alice), usernameStr);
    }
    
    /*//////////////////////////////////////////////////////////////
                        OWNERSHIP TESTS
    //////////////////////////////////////////////////////////////*/
    
    function testOwnerIsSet() public {
        assertEq(registry.owner(), owner);
    }
}