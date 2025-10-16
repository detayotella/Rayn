// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UsernameRegistry
 * @author Rayn Team
 * @notice A registry that maps unique usernames to wallet addresses
 * @dev Allows users to register human-readable usernames for easier transfers
 *
 * HOW IT WORKS:
 * - Users register a unique username that points to their wallet address
 * - Usernames must be 3-20 characters, lowercase alphanumeric + underscores
 * - Each address can have one username; each username can have one address
 * - Users can update or delete their username at any time
 * - Other contracts can resolve usernames to addresses for payments
 *
 * EXAMPLE FLOW:
 * 1. Alice registers "alice_crypto" → maps to 0xABC...
 * 2. Bob wants to send tokens to Alice
 * 3. Bob's app calls resolveUsername("alice_crypto") → returns 0xABC...
 * 4. Transaction is sent to Alice's resolved address
 */
contract UsernameRegistry is Ownable {
    /// @notice Maps username (lowercase string) to owner address
    mapping(string => address) private _usernameToAddress;

    /// @notice Maps address to their registered username
    mapping(address => string) private _addressToUsername;

    /// @notice Minimum allowed username length
    uint256 public constant MIN_USERNAME_LENGTH = 3;

    /// @notice Maximum allowed username length
    uint256 public constant MAX_USERNAME_LENGTH = 20;

    /**
     * @notice Emitted when a new username is registered
     * @param user The address that registered the username
     * @param username The username that was registered
     */
    event UsernameRegistered(address indexed user, string username);

    /**
     * @notice Emitted when a user updates their existing username
     * @param user The address that updated their username
     * @param oldUsername The previous username
     * @param newUsername The new username
     */
    event UsernameUpdated(
        address indexed user,
        string oldUsername,
        string newUsername
    );

    /**
     * @notice Emitted when a user deletes their username
     * @param user The address that deleted their username
     * @param username The username that was deleted
     */
    event UsernameDeleted(address indexed user, string username);

    /**
     * @notice Initializes the UsernameRegistry contract
     * @dev Sets the deployer as the owner
     */
    constructor() Ownable(msg.sender) {
        // Contract is ready - users can now register usernames
    }

    /**
     * @notice Registers a new username for the caller
     * @dev Username must be unique, valid, and caller must not already have one
     * @param username The desired username to register
     *
     * REQUIREMENTS:
     * - Caller must not already have a username registered
     * - Username must not already be taken
     * - Username must be valid (3-20 chars, lowercase alphanumeric + underscores)
     */
    function registerUsername(string memory username) external {
        require(
            bytes(_addressToUsername[msg.sender]).length == 0,
            "UsernameRegistry: caller already has a username"
        );
        require(
            _usernameToAddress[username] == address(0),
            "UsernameRegistry: username already taken"
        );
        require(
            _isValidUsername(username),
            "UsernameRegistry: invalid username format"
        );

        // Store the bidirectional mapping
        _usernameToAddress[username] = msg.sender;
        _addressToUsername[msg.sender] = username;

        emit UsernameRegistered(msg.sender, username);
    }

    /**
     * @notice Updates the caller's existing username to a new one
     * @dev Caller must already have a username, and new username must be available
     * @param newUsername The new username to switch to
     *
     * REQUIREMENTS:
     * - Caller must already have a username registered
     * - New username must not be taken by another user
     * - New username must be valid
     */
    function updateUsername(string memory newUsername) external {
        string memory oldUsername = _addressToUsername[msg.sender];
        require(
            bytes(oldUsername).length > 0,
            "UsernameRegistry: caller has no username to update"
        );
        require(
            _usernameToAddress[newUsername] == address(0),
            "UsernameRegistry: new username already taken"
        );
        require(
            _isValidUsername(newUsername),
            "UsernameRegistry: invalid username format"
        );

        // Clear old mapping and set new one
        delete _usernameToAddress[oldUsername];
        _usernameToAddress[newUsername] = msg.sender;
        _addressToUsername[msg.sender] = newUsername;

        emit UsernameUpdated(msg.sender, oldUsername, newUsername);
    }

    /**
     * @notice Deletes the caller's username registration
     * @dev Frees up the username for others to register
     *
     * REQUIREMENTS:
     * - Caller must have a username registered
     */
    function deleteUsername() external {
        string memory username = _addressToUsername[msg.sender];
        require(
            bytes(username).length > 0,
            "UsernameRegistry: caller has no username to delete"
        );

        // Clear both mappings
        delete _usernameToAddress[username];
        delete _addressToUsername[msg.sender];

        emit UsernameDeleted(msg.sender, username);
    }

    /**
     * @notice Resolves a username to its associated wallet address
     * @dev This is the main function other contracts will call for username-based transfers
     * @param username The username to resolve
     * @return The wallet address associated with the username, or address(0) if not found
     *
     * USAGE EXAMPLE:
     * address recipient = registry.resolveUsername("alice_crypto");
     * if (recipient != address(0)) {
     *     token.transfer(recipient, amount);
     * }
     */
    function resolveUsername(
        string memory username
    ) external view returns (address) {
        return _usernameToAddress[username];
    }

    /**
     * @notice Gets the username registered to a specific address
     * @param user The address to look up
     * @return The username registered to this address, or empty string if none
     */
    function getUsernameOf(address user) external view returns (string memory) {
        return _addressToUsername[user];
    }

    /**
     * @notice Checks if a username is available for registration
     * @param username The username to check
     * @return True if available, false if taken or invalid
     */
    function isUsernameAvailable(
        string memory username
    ) external view returns (bool) {
        return
            _usernameToAddress[username] == address(0) &&
            _isValidUsername(username);
    }

    /**
     * @notice Validates username format
     * @dev Internal function that enforces username rules
     * @param username The username to validate
     * @return True if valid, false otherwise
     *
     * VALIDATION RULES:
     * - Length must be between 3 and 20 characters
     * - Only lowercase letters (a-z), numbers (0-9), and underscores (_)
     * - Cannot start or end with an underscore
     */
    function _isValidUsername(
        string memory username
    ) internal pure returns (bool) {
        bytes memory usernameBytes = bytes(username);
        uint256 length = usernameBytes.length;

        // Check length constraints
        if (length < MIN_USERNAME_LENGTH || length > MAX_USERNAME_LENGTH) {
            return false;
        }

        // Check first and last character are not underscores
        if (usernameBytes[0] == "_" || usernameBytes[length - 1] == "_") {
            return false;
        }

        // Check each character is valid (a-z, 0-9, or _)
        for (uint256 i = 0; i < length; i++) {
            bytes1 char = usernameBytes[i];

            bool isLowercase = (char >= "a" && char <= "z");
            bool isNumeric = (char >= "0" && char <= "9");
            bool isUnderscore = (char == "_");

            if (!isLowercase && !isNumeric && !isUnderscore) {
                return false;
            }
        }

        return true;
    }
}
