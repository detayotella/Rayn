// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./UsernameRegistry.sol";

/**
 * @title RaynPaymentRouter
 * @author Rayn Team
 * @notice Routes token payments using human-readable usernames instead of addresses
 * @dev Integrates with UsernameRegistry to resolve usernames to wallet addresses
 *
 * HOW IT WORKS:
 * 1. USER SETUP:
 *    - Alice registers "alice_crypto" in UsernameRegistry
 *    - Alice's address (0xABC...) is now mapped to "alice_crypto"
 *
 * 2. SENDING TOKENS:
 *    - Bob approves RaynPaymentRouter to spend his tokens
 *    - Bob calls sendToUsername("alice_crypto", amount)
 *    - Contract resolves "alice_crypto" to 0xABC...
 *    - Tokens are transferred from Bob to Alice
 *
 * 3. RECEIVING:
 *    - Alice receives tokens automatically at her wallet address
 *    - No additional action needed from recipient
 *
 * BENEFITS:
 * - ✅ Send to usernames instead of long addresses
 * - ✅ Works with ANY ERC-20 token (USDC, USDT, DAI, etc.)
 * - ✅ Prevents sending to wrong addresses
 * - ✅ User-friendly for non-technical users
 * - ✅ Supports batch payments to multiple usernames
 *
 * SECURITY:
 * - Uses SafeERC20 for safe token transfers
 * - ReentrancyGuard protects against reentrancy attacks
 * - Validates username existence before transfer
 * - No custody of user funds (direct transfers)
 */
contract RaynPaymentRouter is ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice Reference to the UsernameRegistry contract
    UsernameRegistry public immutable usernameRegistry;

    /**
     * @notice Emitted when tokens are sent to a username
     * @param token The ERC-20 token that was transferred
     * @param from Address that sent the tokens
     * @param toUsername Username of the recipient
     * @param toAddress Resolved address of the recipient
     * @param amount Amount of tokens transferred
     * @param note Optional message/memo attached to the transfer
     */
    event TokensSentToUsername(
        address indexed token,
        address indexed from,
        string toUsername,
        address indexed toAddress,
        uint256 amount,
        string note
    );

    /**
     * @notice Emitted when tokens are sent from one username to another
     * @param token The ERC-20 token that was transferred
     * @param fromUsername Username of the sender
     * @param fromAddress Resolved address of the sender
     * @param toUsername Username of the recipient
     * @param toAddress Resolved address of the recipient
     * @param amount Amount of tokens transferred
     * @param note Optional message/memo attached to the transfer
     */
    event TokensSentBetweenUsernames(
        address indexed token,
        string fromUsername,
        address indexed fromAddress,
        string toUsername,
        address indexed toAddress,
        uint256 amount,
        string note
    );

    /**
     * @notice Emitted when a batch payment is completed
     * @param token The ERC-20 token used for batch payment
     * @param from Address that sent the tokens
     * @param recipientCount Number of recipients
     * @param totalAmount Total amount distributed
     */
    event BatchPaymentCompleted(
        address indexed token,
        address indexed from,
        uint256 recipientCount,
        uint256 totalAmount
    );

    /**
     * @notice Initializes the RaynPaymentRouter
     * @param _usernameRegistry Address of the deployed UsernameRegistry contract
     */
    constructor(address _usernameRegistry) {
        require(
            _usernameRegistry != address(0),
            "RaynPaymentRouter: invalid registry address"
        );
        usernameRegistry = UsernameRegistry(_usernameRegistry);
    }

    /**
     * @notice Sends tokens to a recipient identified by username or wallet address
     * @dev Resolves username to address and transfers tokens from caller with optional note
     * @param token Address of the ERC-20 token to send
     * @param recipientIdentifier Username (e.g., "alice_crypto") or wallet address (0x...)
     * @param amount Amount of tokens to send
     * @param note Optional message/memo (e.g., "Pizza dinner", "Thanks!", empty string for no note)
     *
     * REQUIREMENTS:
     * - If username: must be registered and resolve to a valid address
     * - If address: must be a valid non-zero address
     * - Caller must have approved this contract to spend tokens
     * - Caller must have sufficient token balance
     * - Amount must be greater than 0
     *
     * USAGE EXAMPLE:
     * // 1. Approve the router to spend your tokens
     * raynStable.approve(address(paymentRouter), 100_000000);
     *
     * // 2. Send to username with note
     * paymentRouter.sendToUsername(address(raynStable), "alice_crypto", 100_000000, "Coffee");
     *
     * // 3. Send to address without note
     * paymentRouter.sendToUsername(address(raynStable), "0x123...", 50_000000, "");
     */
    function sendToUsername(
        address token,
        string memory recipientIdentifier,
        uint256 amount,
        string memory note
    ) external nonReentrant {
        require(
            token != address(0),
            "RaynPaymentRouter: invalid token address"
        );
        require(
            amount > 0,
            "RaynPaymentRouter: amount must be greater than zero"
        );
        require(
            bytes(recipientIdentifier).length > 0,
            "RaynPaymentRouter: empty recipient"
        );

        address toAddress;
        string memory displayName;

        // Check if recipientIdentifier starts with '@' (username)
        bytes memory identifierBytes = bytes(recipientIdentifier);
        if (identifierBytes[0] == "@") {
            // Remove @ prefix and resolve username
            string memory username = _removeAtSymbol(recipientIdentifier);
            toAddress = usernameRegistry.resolveUsername(username);
            require(
                toAddress != address(0),
                "RaynPaymentRouter: username not registered"
            );
            displayName = username;
        } else {
            // Try to resolve as username first (without @)
            toAddress = usernameRegistry.resolveUsername(recipientIdentifier);

            // If not found as username, try to parse as address
            if (toAddress == address(0)) {
                toAddress = _parseAddress(recipientIdentifier);
                require(
                    toAddress != address(0),
                    "RaynPaymentRouter: invalid recipient (not a username or address)"
                );
                displayName = recipientIdentifier; // Show address as display name
            } else {
                displayName = recipientIdentifier; // Show username as display name
            }
        }

        require(
            toAddress != msg.sender,
            "RaynPaymentRouter: cannot send to yourself"
        );

        // Transfer tokens from sender to recipient
        IERC20(token).safeTransferFrom(msg.sender, toAddress, amount);

        emit TokensSentToUsername(
            token,
            msg.sender,
            displayName,
            toAddress,
            amount,
            note
        );
    }

    /**
     * @notice Sends tokens from a specified address to a username (with optional note)
     * @dev Useful for smart contracts or delegated transfers
     * @param token Address of the ERC-20 token to send
     * @param from Address to send tokens from (must have approved this contract)
     * @param recipientIdentifier Username or wallet address of the recipient
     * @param amount Amount of tokens to send
     * @param note Optional message/memo
     *
     * REQUIREMENTS:
     * - Recipient identifier must resolve to a valid address
     * - 'from' address must have approved this contract
     * - Caller must be authorized by 'from' address (e.g., via approval)
     */
    function sendToUsernameFrom(
        address token,
        address from,
        string memory recipientIdentifier,
        uint256 amount,
        string memory note
    ) external nonReentrant {
        require(
            token != address(0),
            "RaynPaymentRouter: invalid token address"
        );
        require(from != address(0), "RaynPaymentRouter: invalid from address");
        require(
            amount > 0,
            "RaynPaymentRouter: amount must be greater than zero"
        );

        // Resolve recipient (same logic as sendToUsername)
        address toAddress;
        string memory displayName;

        bytes memory identifierBytes = bytes(recipientIdentifier);
        if (identifierBytes[0] == "@") {
            string memory username = _removeAtSymbol(recipientIdentifier);
            toAddress = usernameRegistry.resolveUsername(username);
            require(
                toAddress != address(0),
                "RaynPaymentRouter: username not registered"
            );
            displayName = username;
        } else {
            toAddress = usernameRegistry.resolveUsername(recipientIdentifier);
            if (toAddress == address(0)) {
                toAddress = _parseAddress(recipientIdentifier);
                require(
                    toAddress != address(0),
                    "RaynPaymentRouter: invalid recipient"
                );
                displayName = recipientIdentifier;
            } else {
                displayName = recipientIdentifier;
            }
        }

        require(
            toAddress != from,
            "RaynPaymentRouter: cannot send to yourself"
        );

        // Transfer tokens from 'from' address to recipient
        IERC20(token).safeTransferFrom(from, toAddress, amount);

        emit TokensSentToUsername(
            token,
            from,
            displayName,
            toAddress,
            amount,
            note
        );
    }

    /**
     * @notice Sends tokens between two usernames (with optional note)
     * @dev Both sender and recipient must have registered usernames
     * @param token Address of the ERC-20 token to send
     * @param fromUsername Username of the sender (must be caller)
     * @param toUsername Username of the recipient
     * @param amount Amount of tokens to send
     * @param note Optional message/memo
     *
     * REQUIREMENTS:
     * - Both usernames must be registered
     * - Caller must own the 'fromUsername'
     * - Caller must have approved this contract
     *
     * USAGE EXAMPLE:
     * // Alice sends to Bob using usernames with a note
     * paymentRouter.sendBetweenUsernames(
     *     address(raynStable),
     *     "alice_crypto",
     *     "bob_wallet",
     *     50_000000,
     *     "Lunch money"
     * );
     */
    function sendBetweenUsernames(
        address token,
        string memory fromUsername,
        string memory toUsername,
        uint256 amount,
        string memory note
    ) external nonReentrant {
        require(
            token != address(0),
            "RaynPaymentRouter: invalid token address"
        );
        require(
            amount > 0,
            "RaynPaymentRouter: amount must be greater than zero"
        );

        // Resolve both usernames
        address fromAddress = usernameRegistry.resolveUsername(fromUsername);
        address toAddress = usernameRegistry.resolveUsername(toUsername);

        require(
            fromAddress != address(0),
            "RaynPaymentRouter: sender username not registered"
        );
        require(
            toAddress != address(0),
            "RaynPaymentRouter: recipient username not registered"
        );
        require(
            fromAddress == msg.sender,
            "RaynPaymentRouter: caller does not own sender username"
        );
        require(
            fromAddress != toAddress,
            "RaynPaymentRouter: cannot send to yourself"
        );

        // Transfer tokens
        IERC20(token).safeTransferFrom(fromAddress, toAddress, amount);

        emit TokensSentBetweenUsernames(
            token,
            fromUsername,
            fromAddress,
            toUsername,
            toAddress,
            amount,
            note
        );
    }

    /**
     * @notice Sends tokens to multiple usernames in a single transaction
     * @dev Batch payment function for efficient distribution with optional notes
     * @param token Address of the ERC-20 token to send
     * @param recipients Array of recipient usernames or addresses
     * @param amounts Array of amounts to send (must match recipients length)
     * @param notes Array of optional notes (can be empty strings, must match recipients length)
     *
     * REQUIREMENTS:
     * - Arrays must have same length and not be empty
     * - All recipients must resolve to valid addresses
     * - Caller must have approved sufficient tokens
     * - No recipient can appear twice in the array
     *
     * USAGE EXAMPLE:
     * string[] memory recipients = new string[](3);
     * recipients[0] = "alice_crypto";
     * recipients[1] = "bob_wallet";
     * recipients[2] = "0x123...";
     *
     * uint256[] memory amounts = new uint256[](3);
     * amounts[0] = 100_000000;
     * amounts[1] = 200_000000;
     * amounts[2] = 150_000000;
     *
     * string[] memory notes = new string[](3);
     * notes[0] = "Coffee";
     * notes[1] = "Lunch";
     * notes[2] = "";  // No note
     *
     * paymentRouter.batchSendToUsernames(address(raynStable), recipients, amounts, notes);
     */
    function batchSendToUsernames(
        address token,
        string[] memory recipients,
        uint256[] memory amounts,
        string[] memory notes
    ) external nonReentrant {
        require(
            token != address(0),
            "RaynPaymentRouter: invalid token address"
        );
        require(
            recipients.length > 0,
            "RaynPaymentRouter: empty recipients array"
        );
        require(
            recipients.length == amounts.length &&
                recipients.length == notes.length,
            "RaynPaymentRouter: array length mismatch"
        );
        require(
            recipients.length <= 100,
            "RaynPaymentRouter: too many recipients (max 100)"
        );

        uint256 totalAmount = 0;

        // Process each recipient
        for (uint256 i = 0; i < recipients.length; i++) {
            require(
                amounts[i] > 0,
                "RaynPaymentRouter: amount must be greater than zero"
            );

            // Resolve recipient (username or address)
            address toAddress;
            string memory displayName;

            bytes memory identifierBytes = bytes(recipients[i]);
            if (identifierBytes[0] == "@") {
                string memory username = _removeAtSymbol(recipients[i]);
                toAddress = usernameRegistry.resolveUsername(username);
                require(
                    toAddress != address(0),
                    "RaynPaymentRouter: username not registered"
                );
                displayName = username;
            } else {
                toAddress = usernameRegistry.resolveUsername(recipients[i]);
                if (toAddress == address(0)) {
                    toAddress = _parseAddress(recipients[i]);
                    require(
                        toAddress != address(0),
                        "RaynPaymentRouter: invalid recipient"
                    );
                    displayName = recipients[i];
                } else {
                    displayName = recipients[i];
                }
            }

            require(
                toAddress != msg.sender,
                "RaynPaymentRouter: cannot send to yourself"
            );

            // Transfer tokens
            IERC20(token).safeTransferFrom(msg.sender, toAddress, amounts[i]);
            totalAmount += amounts[i];

            emit TokensSentToUsername(
                token,
                msg.sender,
                displayName,
                toAddress,
                amounts[i],
                notes[i]
            );
        }

        emit BatchPaymentCompleted(
            token,
            msg.sender,
            recipients.length,
            totalAmount
        );
    }

    /**
     * @notice Resolves a username to its wallet address
     * @dev Convenience function that wraps UsernameRegistry.resolveUsername()
     * @param username The username to resolve
     * @return The wallet address, or address(0) if not found
     */
    function resolveUsername(
        string memory username
    ) external view returns (address) {
        return usernameRegistry.resolveUsername(username);
    }

    /**
     * @notice Gets the username of an address
     * @dev Convenience function that wraps UsernameRegistry.getUsernameOf()
     * @param user The address to look up
     * @return The username, or empty string if none registered
     */
    function getUsernameOf(address user) external view returns (string memory) {
        return usernameRegistry.getUsernameOf(user);
    }

    /**
     * @notice Checks if a username is registered
     * @param username The username to check
     * @return True if registered and resolves to a valid address
     */
    function isUsernameRegistered(
        string memory username
    ) external view returns (bool) {
        return usernameRegistry.resolveUsername(username) != address(0);
    }

    /**
     * @notice Validates that a username exists and returns the recipient's info
     * @dev Useful for frontend validation before sending
     * @param username The username to validate
     * @return isValid True if username is registered
     * @return recipientAddress The resolved wallet address
     * @return recipientUsername The registered username (for confirmation)
     */
    function validateRecipient(
        string memory username
    )
        external
        view
        returns (
            bool isValid,
            address recipientAddress,
            string memory recipientUsername
        )
    {
        recipientAddress = usernameRegistry.resolveUsername(username);
        isValid = recipientAddress != address(0);

        if (isValid) {
            recipientUsername = usernameRegistry.getUsernameOf(
                recipientAddress
            );
        }
    }

    /**
     * @notice Calculates total amount needed for a batch payment
     * @dev Helper function for frontend to calculate approval amount
     * @param amounts Array of amounts to send
     * @return Total sum of all amounts
     */
    function calculateBatchTotal(
        uint256[] memory amounts
    ) external pure returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            total += amounts[i];
        }
        return total;
    }

    // ============================================
    // INTERNAL HELPER FUNCTIONS
    // ============================================

    /**
     * @notice Removes @ symbol from beginning of string
     * @dev Internal helper function
     * @param str Input string (e.g., "@alice_crypto")
     * @return String without @ prefix (e.g., "alice_crypto")
     */
    function _removeAtSymbol(
        string memory str
    ) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        require(strBytes.length > 1, "RaynPaymentRouter: string too short");

        bytes memory result = new bytes(strBytes.length - 1);
        for (uint256 i = 1; i < strBytes.length; i++) {
            result[i - 1] = strBytes[i];
        }

        return string(result);
    }

    /**
     * @notice Attempts to parse a string as an Ethereum address
     * @dev Internal helper function - returns address(0) if parsing fails
     * @param str Input string (e.g., "0x1234...")
     * @return Parsed address or address(0) if invalid
     */
    function _parseAddress(string memory str) internal pure returns (address) {
        bytes memory strBytes = bytes(str);

        // Check if string starts with "0x" and has correct length
        if (strBytes.length != 42) {
            return address(0);
        }
        if (strBytes[0] != "0" || strBytes[1] != "x") {
            return address(0);
        }

        // Try to parse hex string to address
        bytes memory addrBytes = new bytes(20);
        for (uint256 i = 0; i < 20; i++) {
            uint8 high = _hexCharToByte(strBytes[2 + i * 2]);
            uint8 low = _hexCharToByte(strBytes[3 + i * 2]);

            if (high == 255 || low == 255) {
                return address(0); // Invalid hex character
            }

            addrBytes[i] = bytes1(high * 16 + low);
        }

        address parsed;
        assembly {
            parsed := mload(add(addrBytes, 20))
        }

        return parsed;
    }

    /**
     * @notice Converts a hex character to its byte value
     * @dev Internal helper function
     * @param char Hex character ('0'-'9', 'a'-'f', 'A'-'F')
     * @return Byte value (0-15) or 255 if invalid
     */
    function _hexCharToByte(bytes1 char) internal pure returns (uint8) {
        uint8 c = uint8(char);

        if (c >= 48 && c <= 57) {
            return c - 48; // '0'-'9'
        }
        if (c >= 97 && c <= 102) {
            return c - 87; // 'a'-'f'
        }
        if (c >= 65 && c <= 70) {
            return c - 55; // 'A'-'F'
        }

        return 255; // Invalid
    }
}
