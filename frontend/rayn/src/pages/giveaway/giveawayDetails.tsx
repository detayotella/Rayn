import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Bell,
  Copy,
  Link as LinkIcon,
  Lock,
  Power,
  Megaphone,
  RefreshCw,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useWallet } from "../../context/WalletContext";
import { useApp } from "../../context/AppContext";
import { ethers } from "ethers";

interface GiveawayData {
  id: string;
  creator: string;
  token: string;
  totalAmount: string;
  winnersCount: string;
  claimedCount: string;
  endTime: string;
  isPrivate: boolean;
  active: boolean;
  disposed: boolean;
}

interface ClaimEvent {
  id: string;
  winner: string;
  amount: string;
  blockNumber: number;
  transactionHash: string;
  timestamp: number;
}

const GiveawayDetails: React.FC = () => {
  const [copiedField, setCopiedField] = useState<"link" | "pin" | null>(null);
  const [giveawayData, setGiveawayData] = useState<GiveawayData | null>(null);
  const [claimEvents, setClaimEvents] = useState<ClaimEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCanClaim, setUserCanClaim] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const navigate = useNavigate();
  const { id: giveawayId } = useParams<{ id: string }>();
  const {
    giveawayDistContract,
    raynStableContract,
    usernameRegContract,
    account,
    isWalletConnected,
  } = useWallet();
  const { addNotification, user } = useApp();

  // Load giveaway data from blockchain
  const loadGiveawayData = async (showRefreshIndicator = false) => {
    if (!giveawayDistContract || !giveawayId) {
      setError("Contract not available or invalid giveaway ID");
      setLoading(false);
      return;
    }

    if (showRefreshIndicator) {
      setRefreshing(true);
    }

    try {
      console.log(`🔍 Loading giveaway data for ID: ${giveawayId}`);

      // Get basic giveaway info
      const giveaway = await giveawayDistContract.giveaways(giveawayId);

      if (giveaway.creator === "0x0000000000000000000000000000000000000000") {
        setError("Giveaway not found");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Format the data
      const formattedData: GiveawayData = {
        id: giveawayId,
        creator: giveaway.creator,
        token: giveaway.token,
        totalAmount: ethers.formatUnits(giveaway.totalAmount, 6),
        winnersCount: giveaway.winnersCount.toString(),
        claimedCount: giveaway.claimedCount.toString(),
        endTime: giveaway.endTime.toString(),
        isPrivate: giveaway.isPrivate,
        active: giveaway.active,
        disposed: giveaway.disposed,
      };

      setGiveawayData(formattedData);

      // Check if current user can claim
      if (account && isWalletConnected) {
        const hasClaimed = await giveawayDistContract.hasClaimed(
          giveawayId,
          account
        );
        const canClaim =
          formattedData.active &&
          !hasClaimed &&
          parseInt(formattedData.claimedCount) <
            parseInt(formattedData.winnersCount) &&
          Date.now() / 1000 < parseInt(formattedData.endTime);
        setUserCanClaim(canClaim);
      }

      // Load claim events
      await loadClaimEvents();

      console.log(`✅ Giveaway data loaded successfully:`, formattedData);
    } catch (error) {
      console.error("❌ Error loading giveaway data:", error);
      setError("Failed to load giveaway data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load claim events from blockchain
  const loadClaimEvents = async () => {
    if (!giveawayDistContract || !giveawayId) return;

    try {
      // Get RewardClaimed events for this giveaway
      const filter = giveawayDistContract.filters.RewardClaimed(giveawayId);
      const events = await giveawayDistContract.queryFilter(filter);

      const formattedEvents: ClaimEvent[] = [];

      for (const event of events) {
        const evt: any = event;
        if (evt.args) {
          const block = await evt.getBlock();

          formattedEvents.push({
            id: evt.args[0].toString(),
            winner: evt.args[1],
            amount: ethers.formatUnits(evt.args[2], 6),
            blockNumber: evt.blockNumber,
            transactionHash: evt.transactionHash,
            timestamp: block.timestamp * 1000,
          });
        }
      }

      // Sort by timestamp (newest first)
      formattedEvents.sort((a, b) => b.timestamp - a.timestamp);
      setClaimEvents(formattedEvents);

      console.log(`📊 Loaded ${formattedEvents.length} claim events`);
    } catch (error) {
      console.error("❌ Error loading claim events:", error);
    }
  };

  // Resolve username from address
  const resolveUsername = async (address: string): Promise<string> => {
    if (!usernameRegContract) return address;

    try {
      const username = await usernameRegContract.getUsernameOf(address);
      return username || address;
    } catch {
      return address;
    }
  };

  // Claim reward function
  const handleClaimReward = async () => {
    if (!giveawayDistContract || !account || !giveawayId) {
      addNotification({
        type: "error",
        title: "Cannot Claim",
        message: "Wallet not connected or contract not available",
      });
      return;
    }

    setClaiming(true);

    try {
      console.log(
        `🎯 Claiming reward from giveaway ${giveawayId} for ${account}`
      );

      addNotification({
        type: "info",
        title: "Claiming Reward",
        message: "Please confirm the transaction in your wallet...",
      });

      const claimTx = await giveawayDistContract.claimReward(giveawayId);

      addNotification({
        type: "info",
        title: "Transaction Submitted",
        message: "Your claim is being processed on the blockchain...",
      });

      const receipt = await claimTx.wait();

      console.log(
        `✅ Reward claimed successfully! Block: ${receipt.blockNumber}`
      );

      addNotification({
        type: "success",
        title: "Reward Claimed!",
        message: `Successfully claimed your reward from the giveaway`,
      });

      // Refresh giveaway data
      await loadGiveawayData(true);
      setUserCanClaim(false);
    } catch (error: any) {
      console.error("❌ Claim failed:", error);

      let errorMessage = "Failed to claim reward. Please try again.";

      if (error.code === 4001) {
        errorMessage = "Transaction was cancelled by user.";
      } else if (error.code === "CALL_EXCEPTION") {
        if (error.reason?.includes("already claimed")) {
          errorMessage = "You have already claimed from this giveaway.";
        } else if (error.reason?.includes("all rewards claimed")) {
          errorMessage = "All rewards have been claimed.";
        } else if (error.reason?.includes("expired")) {
          errorMessage = "This giveaway has expired.";
        } else {
          errorMessage = `Claim failed: ${error.reason || error.message}`;
        }
      }

      addNotification({
        type: "error",
        title: "Claim Failed",
        message: errorMessage,
      });
    } finally {
      setClaiming(false);
    }
  };

  // End giveaway function (for creators)
  const handleEndGiveaway = async () => {
    if (!giveawayDistContract || !giveawayId) return;

    try {
      addNotification({
        type: "info",
        title: "Ending Giveaway",
        message: "Please confirm the transaction in your wallet...",
      });

      const endTx = await giveawayDistContract.endGiveaway(giveawayId);
      await endTx.wait();

      addNotification({
        type: "success",
        title: "Giveaway Ended",
        message: "The giveaway has been ended successfully",
      });

      // Refresh data
      await loadGiveawayData(true);
    } catch (error: any) {
      console.error("❌ End giveaway failed:", error);

      let errorMessage = "Failed to end giveaway.";
      if (error.code === 4001) {
        errorMessage = "Transaction was cancelled by user.";
      } else if (error.reason) {
        errorMessage = `Error: ${error.reason}`;
      }

      addNotification({
        type: "error",
        title: "Failed to End Giveaway",
        message: errorMessage,
      });
    }
  };

  // Copy functions
  const handleCopy = async (value: string, field: "link" | "pin") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      addNotification({
        type: "success",
        title: "Copied!",
        message: `${field === "link" ? "Link" : "PIN"} copied to clipboard`,
      });
    } catch (error) {
      console.error("Failed to copy text:", error);
      addNotification({
        type: "error",
        title: "Copy Failed",
        message: "Could not copy to clipboard",
      });
    }
  };

  // Load data on mount
  useEffect(() => {
    if (giveawayDistContract && giveawayId) {
      loadGiveawayData();
    }
  }, [giveawayDistContract, giveawayId, account]);

  // Helper functions
  const formatTimeRemaining = (endTime: string) => {
    const now = Date.now() / 1000;
    const end = parseInt(endTime);
    const remaining = end - now;

    if (remaining <= 0) return "Expired";

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isCreator =
    account &&
    giveawayData &&
    account.toLowerCase() === giveawayData.creator.toLowerCase();

  const shareLink = `https://rayn.app/giveaway/${giveawayId}`;
  const giveawayPin = giveawayId || "123456";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0419] text-white font-DMSans flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-gray-400">Loading giveaway details...</p>
        </div>
      </div>
    );
  }

  if (error || !giveawayData) {
    return (
      <div className="min-h-screen bg-[#0e0419] text-white font-DMSans flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold mb-2">Giveaway Not Found</h2>
          <p className="text-gray-400 mb-6">
            {error || "The requested giveaway could not be found."}
          </p>
          <button
            onClick={() => navigate("/giveaway")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Giveaways
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0419] text-white font-DMSans">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-[#130625]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-purple-600/70 hover:bg-purple-600 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-2xl font-semibold">Rayn</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => loadGiveawayData(true)}
              disabled={refreshing}
              className="p-2 rounded-full bg-purple-900/40 hover:bg-purple-900/60 transition-colors"
            >
              <RefreshCw
                className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
            <button className="p-2 rounded-full bg-purple-900/40 hover:bg-purple-900/60 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-700/40">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl font-semibold">
              Giveaway #{giveawayId}
            </h1>
            {isCreator && (
              <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                Your Giveaway
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            {isCreator
              ? "Manage your hosted giveaway and track its progress."
              : "View giveaway details and claim your reward."}
          </p>
        </section>

        {/* Giveaway Status */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-200">
            Giveaway Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1d0f31] border border-purple-900/40 rounded-2xl px-6 py-5 space-y-2">
              <p className="text-sm text-gray-400">Status</p>
              <div className="flex items-center gap-2">
                {giveawayData.active ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <p
                  className={`text-xl font-semibold ${
                    giveawayData.active ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {giveawayData.active ? "Active" : "Ended"}
                </p>
              </div>
            </div>
            <div className="bg-[#1d0f31] border border-purple-900/40 rounded-2xl px-6 py-5 space-y-2">
              <p className="text-sm text-gray-400">Total Amount</p>
              <p className="text-xl font-semibold">
                {giveawayData.totalAmount} RAYNS
              </p>
            </div>
            <div className="bg-[#1d0f31] border border-purple-900/40 rounded-2xl px-6 py-5 space-y-2">
              <p className="text-sm text-gray-400">Progress</p>
              <p className="text-xl font-semibold">
                {giveawayData.claimedCount}/{giveawayData.winnersCount} claimed
              </p>
            </div>
            <div className="bg-[#1d0f31] border border-purple-900/40 rounded-2xl px-6 py-5 space-y-2">
              <p className="text-sm text-gray-400">Time Remaining</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <p className="text-sm font-semibold">
                  {formatTimeRemaining(giveawayData.endTime)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Claim Section for Users */}
        {!isCreator && userCanClaim && (
          <section className="bg-gradient-to-r from-green-900/20 to-emerald-800/20 border border-green-700/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-2">
                  You can claim a reward!
                </h3>
                <p className="text-gray-300">
                  Claim your share: ~
                  {(
                    parseFloat(giveawayData.totalAmount) /
                    parseInt(giveawayData.winnersCount)
                  ).toFixed(2)}{" "}
                  RAYNS
                </p>
              </div>
              <button
                onClick={handleClaimReward}
                disabled={claiming}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {claiming ? "Claiming..." : "Claim Reward"}
              </button>
            </div>
          </section>
        )}

        {/* Participants/Claims */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-200">
              {claimEvents.length > 0 ? "Recent Claims" : "No Claims Yet"}
            </h2>
            {isCreator && claimEvents.length > 0 && (
              <button className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 transition-colors">
                <Megaphone className="w-5 h-5" />
                <span className="font-medium">Send Reminder</span>
              </button>
            )}
          </div>

          {claimEvents.length > 0 ? (
            <div className="bg-[#1d0f31] border border-purple-900/40 rounded-3xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-900/40 text-sm text-gray-400 uppercase tracking-wide">
                    <th className="px-6 py-4 text-left font-medium">Winner</th>
                    <th className="px-6 py-4 text-right font-medium">Amount</th>
                    <th className="px-6 py-4 text-right font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {claimEvents.map((claim, index) => (
                    <tr
                      key={index}
                      className="border-b border-purple-900/40 last:border-b-0 text-base text-gray-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {formatAddress(claim.winner)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-green-400">
                        {claim.amount} RAYNS
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-400">
                        {new Date(claim.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-[#1d0f31] border border-purple-900/40 rounded-3xl p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">
                No one has claimed yet. Be the first!
              </p>
            </div>
          )}
        </section>

        {/* Share Section */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-200">
            Share Giveaway
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Shareable Link</label>
              <div className="flex items-center gap-3 bg-[#1d0f31] border border-purple-900/40 rounded-2xl px-4 py-3">
                <LinkIcon className="w-5 h-5 text-purple-400" />
                <span className="flex-1 text-gray-200 truncate">
                  {shareLink}
                </span>
                <button
                  onClick={() => handleCopy(shareLink, "link")}
                  className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copiedField === "link" && (
                <p className="text-xs text-green-400">
                  Link copied to clipboard.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Giveaway ID</label>
              <div className="flex items-center gap-3 bg-[#1d0f31] border border-purple-900/40 rounded-2xl px-4 py-3">
                <Lock className="w-5 h-5 text-purple-400" />
                <span className="flex-1 text-gray-200 tracking-[0.2em] text-center md:text-left">
                  {giveawayPin}
                </span>
                <button
                  onClick={() => handleCopy(giveawayPin, "pin")}
                  className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copiedField === "pin" && (
                <p className="text-xs text-green-400">
                  ID copied to clipboard.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Creator Actions */}
        {isCreator && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-200">
              Giveaway Actions
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleEndGiveaway}
                disabled={!giveawayData.active}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                <Power className="w-5 h-5" />
                <span className="font-medium">
                  {giveawayData.active ? "End Giveaway" : "Already Ended"}
                </span>
              </button>

              {!giveawayData.active && !giveawayData.disposed && (
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 transition-colors">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-medium">Withdraw Unclaimed</span>
                </button>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default GiveawayDetails;
