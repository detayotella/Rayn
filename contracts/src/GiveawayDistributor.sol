// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GiveawayDistributor
 * @author Rayn Team
 * @notice Manages creation, claiming, and distribution of time-limited token giveaways
 * @dev Handles both public and private giveaways with configurable winner counts and expiration
 *
 * HOW IT WORKS:
 * 1. CREATION: A creator funds a giveaway with ERC-20 tokens, specifying:
 *    - Total prize pool (e.g., 1000 USDC)
 *    - Number of winners (e.g., 10 winners)
 *    - Expiration time (UNIX timestamp)
 *    - Public or private visibility
 *
 * 2. CLAIMING: Users claim their share of the prize pool
 *    - Reward per winner = totalAmount / winnersCount
 *    - Each address can claim only once
 *    - Claims are blocked after expiration or when all winners have claimed
 *
 * 3. ENDING: Giveaway becomes inactive when:
 *    - All winners have claimed their rewards, OR
 *    - The expiration time has passed
 *
 * 4. DISPOSAL: After expiration, creator can withdraw any unclaimed tokens
 *
 * RANDOMNESS:
 * - Phase 1 (Testnets): Uses keccak256-based pseudo-randomness
 * - Phase 2 (Mainnet): Architecture ready for Chainlink/Gelato VRF integration
 *
 * SECURITY:
 * - ReentrancyGuard prevents reentrancy attacks
 * - SafeERC20 ensures safe token transfers
 * - Comprehensive validation on all inputs
 */
contract GiveawayDistributor is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice Stores all information about a single giveaway
    struct Giveaway {
        address creator; // Address that created and funded the giveaway
        IERC20 token; // ERC-20 token being distributed
        uint256 totalAmount; // Total prize pool
        uint256 winnersCount; // Maximum number of winners
        uint256 claimedCount; // Current number of claims
        uint256 endTime; // UNIX timestamp when giveaway expires
        bool isPrivate; // True if giveaway is private/invite-only
        bool active; // True if giveaway is still accepting claims
        bool disposed; // True if creator has withdrawn unclaimed tokens
    }

    /// @notice Counter for giveaway IDs (auto-incrementing)
    uint256 private _nextGiveawayId;

    /// @notice Maps giveaway ID to Giveaway struct
    mapping(uint256 => Giveaway) public giveaways;

    /// @notice Tracks which addresses have claimed from which giveaway
    mapping(uint256 => mapping(address => bool)) public hasClaimed;

    /// @notice Stores randomly selected winners for a giveaway (if announced)
    mapping(uint256 => address[]) public announcedWinners;

    /**
     * @notice Emitted when a new giveaway is created
     * @param id Unique identifier for the giveaway
     * @param creator Address that created the giveaway
     * @param token ERC-20 token being distributed
     * @param totalAmount Total prize pool
     * @param winnersCount Maximum number of winners
     * @param endTime Expiration timestamp
     */
    event GiveawayCreated(
        uint256 indexed id,
        address indexed creator,
        address indexed token,
        uint256 totalAmount,
        uint256 winnersCount,
        uint256 endTime
    );

    /**
     * @notice Emitted when a user successfully claims their reward
     * @param id Giveaway identifier
     * @param winner Address that claimed the reward
     * @param amount Amount of tokens claimed
     */
    event RewardClaimed(
        uint256 indexed id,
        address indexed winner,
        uint256 amount
    );

    /**
     * @notice Emitted when a giveaway ends (either by filling up or expiring)
     * @param id Giveaway identifier
     * @param expired True if ended due to expiration, false if all winners claimed
     */
    event GiveawayEnded(uint256 indexed id, bool expired);

    /**
     * @notice Emitted when winners are randomly selected and announced
     * @param id Giveaway identifier
     * @param winners Array of selected winner addresses
     */
    event WinnersAnnounced(uint256 indexed id, address[] winners);

    /**
     * @notice Emitted when creator withdraws unclaimed tokens after expiration
     * @param id Giveaway identifier
     * @param leftoverTokens Amount of tokens returned to creator
     */
    event GiveawayDisposed(uint256 indexed id, uint256 leftoverTokens);

    /**
     * @notice Initializes the GiveawayDistributor contract
     * @dev Sets deployer as owner and initializes giveaway counter
     */
    constructor() Ownable(msg.sender) {
        _nextGiveawayId = 1; // Start IDs from 1 (0 reserved for checks)
    }

    /**
     * @notice Creates a new giveaway campaign
     * @dev Transfers tokens from creator to this contract
     * @param token Address of the ERC-20 token to distribute
     * @param totalAmount Total prize pool (must be divisible by winnersCount for fair distribution)
     * @param winnersCount Number of winners that can claim
     * @param endTime UNIX timestamp when giveaway expires
     * @param isPrivate True for private/invite-only giveaways
     * @return giveawayId The unique identifier for the created giveaway
     *
     * REQUIREMENTS:
     * - winnersCount must be greater than 0
     * - endTime must be in the future
     * - totalAmount must be greater than 0
     * - Creator must have approved this contract to spend tokens
     */
    function createGiveaway(
        address token,
        uint256 totalAmount,
        uint256 winnersCount,
        uint256 endTime,
        bool isPrivate
    ) external nonReentrant returns (uint256 giveawayId) {
        require(
            token != address(0),
            "GiveawayDistributor: invalid token address"
        );
        require(
            winnersCount > 0,
            "GiveawayDistributor: must have at least one winner"
        );
        require(
            totalAmount > 0,
            "GiveawayDistributor: total amount must be greater than zero"
        );
        require(
            endTime > block.timestamp,
            "GiveawayDistributor: end time must be in the future"
        );
        require(
            totalAmount >= winnersCount,
            "GiveawayDistributor: total amount too small for winner count"
        );

        // Generate new giveaway ID
        giveawayId = _nextGiveawayId++;

        // Store giveaway details
        giveaways[giveawayId] = Giveaway({
            creator: msg.sender,
            token: IERC20(token),
            totalAmount: totalAmount,
            winnersCount: winnersCount,
            claimedCount: 0,
            endTime: endTime,
            isPrivate: isPrivate,
            active: true,
            disposed: false
        });

        // Transfer tokens from creator to contract (requires prior approval)
        IERC20(token).safeTransferFrom(msg.sender, address(this), totalAmount);

        emit GiveawayCreated(
            giveawayId,
            msg.sender,
            token,
            totalAmount,
            winnersCount,
            endTime
        );
    }

    /**
     * @notice Allows a user to claim their reward from a giveaway
     * @dev Calculates reward per winner and transfers tokens to claimer
     * @param giveawayId The ID of the giveaway to claim from
     *
     * REQUIREMENTS:
     * - Giveaway must be active
     * - Giveaway must not be expired
     * - Caller must not have already claimed
     * - There must be available winner slots
     *
     * AUTOMATIC ENDING:
     * If this claim fills the last winner slot, the giveaway is automatically ended
     */
    function claimReward(uint256 giveawayId) external nonReentrant {
        Giveaway storage giveaway = giveaways[giveawayId];

        // Validation checks
        require(giveaway.active, "GiveawayDistributor: giveaway is not active");
        require(
            block.timestamp <= giveaway.endTime,
            "GiveawayDistributor: giveaway has expired"
        );
        require(
            !hasClaimed[giveawayId][msg.sender],
            "GiveawayDistributor: already claimed"
        );
        require(
            giveaway.claimedCount < giveaway.winnersCount,
            "GiveawayDistributor: all rewards claimed"
        );

        // Calculate reward per winner
        uint256 rewardAmount = giveaway.totalAmount / giveaway.winnersCount;

        // Mark as claimed and increment counter
        hasClaimed[giveawayId][msg.sender] = true;
        giveaway.claimedCount++;

        // Transfer reward to claimer
        giveaway.token.safeTransfer(msg.sender, rewardAmount);

        emit RewardClaimed(giveawayId, msg.sender, rewardAmount);

        // Automatically end giveaway if all winners have claimed
        if (giveaway.claimedCount == giveaway.winnersCount) {
            giveaway.active = false;
            emit GiveawayEnded(giveawayId, false);
        }
    }

    /**
     * @notice Manually ends a giveaway (only callable by creator or owner)
     * @dev Can be used to close a giveaway early if needed
     * @param giveawayId The ID of the giveaway to end
     *
     * REQUIREMENTS:
     * - Caller must be the giveaway creator or contract owner
     * - Giveaway must be active
     * - Giveaway must be expired OR caller must be contract owner
     */
    function endGiveaway(uint256 giveawayId) external {
        Giveaway storage giveaway = giveaways[giveawayId];

        require(giveaway.active, "GiveawayDistributor: giveaway already ended");
        require(
            msg.sender == giveaway.creator || msg.sender == owner(),
            "GiveawayDistributor: only creator or owner can end giveaway"
        );

        // Only allow ending if expired, or if caller is the owner (emergency)
        if (msg.sender != owner()) {
            require(
                block.timestamp > giveaway.endTime,
                "GiveawayDistributor: giveaway has not expired yet"
            );
        }

        giveaway.active = false;
        emit GiveawayEnded(giveawayId, block.timestamp > giveaway.endTime);
    }

    /**
     * @notice Allows creator to withdraw unclaimed tokens after expiration
     * @dev Can only be called after giveaway has ended
     * @param giveawayId The ID of the giveaway to dispose
     *
     * REQUIREMENTS:
     * - Caller must be the giveaway creator
     * - Giveaway must be inactive (ended)
     * - Giveaway must not already be disposed
     *
     * RETURNS:
     * Any unclaimed tokens are sent back to the creator
     */
    function disposeGiveaway(uint256 giveawayId) external nonReentrant {
        Giveaway storage giveaway = giveaways[giveawayId];

        require(
            msg.sender == giveaway.creator,
            "GiveawayDistributor: only creator can dispose"
        );
        require(
            !giveaway.active,
            "GiveawayDistributor: giveaway is still active"
        );
        require(!giveaway.disposed, "GiveawayDistributor: already disposed");

        giveaway.disposed = true;

        // Calculate leftover tokens (unclaimed rewards)
        uint256 claimedAmount = (giveaway.totalAmount / giveaway.winnersCount) *
            giveaway.claimedCount;
        uint256 leftoverAmount = giveaway.totalAmount - claimedAmount;

        // Transfer remaining tokens back to creator
        if (leftoverAmount > 0) {
            giveaway.token.safeTransfer(giveaway.creator, leftoverAmount);
        }

        emit GiveawayDisposed(giveawayId, leftoverAmount);
    }

    /**
     * @notice Announces winners using pseudo-random selection (testnet only)
     * @dev Uses keccak256-based randomness. NOT suitable for mainnet production.
     * @param giveawayId The ID of the giveaway
     * @param participants Array of eligible participant addresses
     *
     * PHASE 1 (TESTNETS):
     * This function uses block.prevrandao and block.timestamp for randomness.
     * This is pseudo-random and can be influenced by miners/validators.
     *
     * PHASE 2 (MAINNET):
     * This will be replaced with Chainlink VRF, Gelato VRF, or RedStone VRF
     * once available on the Lisk network.
     *
     * REQUIREMENTS:
     * - Only callable by contract owner or giveaway creator
     * - Participants array must not be empty
     */
    function announceWinners(
        uint256 giveawayId,
        address[] memory participants
    ) external {
        Giveaway storage giveaway = giveaways[giveawayId];

        require(
            msg.sender == owner() || msg.sender == giveaway.creator,
            "GiveawayDistributor: only owner or creator can announce winners"
        );
        require(
            participants.length > 0,
            "GiveawayDistributor: no participants provided"
        );
        require(
            announcedWinners[giveawayId].length == 0,
            "GiveawayDistributor: winners already announced"
        );

        uint256 numWinners = giveaway.winnersCount > participants.length
            ? participants.length
            : giveaway.winnersCount;

        address[] memory winners = new address[](numWinners);
        uint256 seed = _generateRandomSeed(giveawayId);

        // Simple random selection (testnet only - not production secure)
        for (uint256 i = 0; i < numWinners; i++) {
            uint256 randomIndex = uint256(
                keccak256(abi.encodePacked(seed, i))
            ) % participants.length;
            winners[i] = participants[randomIndex];
        }

        announcedWinners[giveawayId] = winners;
        emit WinnersAnnounced(giveawayId, winners);
    }

    /**
     * @notice Generates a pseudo-random seed for winner selection
     * @dev TESTNET ONLY - uses block.prevrandao and block.timestamp
     * @param giveawayId The giveaway ID for additional entropy
     * @return A pseudo-random uint256 value
     *
     * WARNING:
     * This is NOT cryptographically secure and should ONLY be used on testnets.
     * For mainnet, integrate Chainlink VRF or similar oracle service.
     */
    function _generateRandomSeed(
        uint256 giveawayId
    ) internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        msg.sender,
                        giveawayId,
                        _nextGiveawayId
                    )
                )
            );
    }

    /**
     * @notice Gets the list of announced winners for a giveaway
     * @param giveawayId The ID of the giveaway
     * @return Array of winner addresses
     */
    function getAnnouncedWinners(
        uint256 giveawayId
    ) external view returns (address[] memory) {
        return announcedWinners[giveawayId];
    }

    /**
     * @notice Calculates the reward amount per winner
     * @param giveawayId The ID of the giveaway
     * @return The amount each winner receives
     */
    function getRewardPerWinner(
        uint256 giveawayId
    ) external view returns (uint256) {
        Giveaway storage giveaway = giveaways[giveawayId];
        require(
            giveaway.winnersCount > 0,
            "GiveawayDistributor: invalid giveaway"
        );
        return giveaway.totalAmount / giveaway.winnersCount;
    }

    /**
     * @notice Checks if a giveaway is currently expired
     * @param giveawayId The ID of the giveaway
     * @return True if current time is past the end time
     */
    function isGiveawayExpired(
        uint256 giveawayId
    ) external view returns (bool) {
        return block.timestamp > giveaways[giveawayId].endTime;
    }

    /**
     * @notice Gets the total number of giveaways created
     * @return The count of giveaways
     */
    function getTotalGiveaways() external view returns (uint256) {
        return _nextGiveawayId - 1;
    }

    // ============================================
    // FUTURE VRF INTEGRATION (Phase 2 - Mainnet)
    // ============================================

    /**
     * @notice Placeholder for requesting randomness from an oracle (Chainlink/Gelato VRF)
     * @dev Will be implemented when VRF services are available on Lisk
     * @param giveawayId The giveaway that needs random winner selection
     *
     * FUTURE IMPLEMENTATION:
     * This will call Chainlink VRF's requestRandomWords() or equivalent,
     * which will trigger a callback to fulfillRandomness()
     */
    function requestRandomness(uint256 giveawayId) external onlyOwner {
        // Placeholder for VRF integration
        // Will implement when Chainlink/Gelato/RedStone VRF is available on Lisk
        require(
            giveaways[giveawayId].creator != address(0),
            "GiveawayDistributor: invalid giveaway"
        );
        revert(
            "GiveawayDistributor: VRF not yet implemented - use announceWinners for testnets"
        );
    }

    /**
     * @notice Placeholder for receiving randomness from VRF oracle
     * @dev Will be called by VRF coordinator once random value is ready
     * @param giveawayId The giveaway ID
     * @param randomValue The provably random value from VRF
     *
     * FUTURE IMPLEMENTATION:
     * This callback will use the random value to select winners fairly
     */
    function fulfillRandomness(
        uint256 giveawayId,
        uint256 randomValue
    ) internal {
        // Placeholder for VRF callback
        // Will implement when VRF infrastructure is available
        require(
            giveawayId > 0 && randomValue > 0,
            "GiveawayDistributor: invalid parameters"
        );
    }
}
