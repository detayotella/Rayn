import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Clock,
  Users,
  Globe2,
  Lock,
  Check,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import Logo from "../../assets/Logo.png";
import { useWallet } from "../../context/WalletContext";
import { useApp } from "../../context/AppContext";
import { ethers } from "ethers";

type Step = 1 | 2 | 3 | 4 | 5;

interface TokenApproval {
  isApproved: boolean;
  isApproving: boolean;
  currentAllowance: string;
  error: string | null;
}

export default function CreateGiveaway(): React.JSX.Element {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isCreating, setIsCreating] = useState(false);

  // Wallet and contract context
  const {
    isWalletConnected,
    giveawayDistContract,
    raynStableContract,
    account,
    initializeContracts,
  } = useWallet();
  const { addNotification, setIsLoading } = useApp();

  // Form state
  const [prizeAmount, setPrizeAmount] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [durationType, setDurationType] = useState<"hours" | "days">("days");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [requireFollow, setRequireFollow] = useState<boolean>(false);
  const [requireShare, setRequireShare] = useState<boolean>(false);
  const [minAccountAge, setMinAccountAge] = useState<string>("0");
  const [numberOfWinners, setNumberOfWinners] = useState<string>("1");

  // Token approval state
  const [tokenApproval, setTokenApproval] = useState<TokenApproval>({
    isApproved: false,
    isApproving: false,
    currentAllowance: "0",
    error: null,
  });

  const steps = [
    { number: 1, title: "Prize Amount" },
    { number: 2, title: "Duration" },
    { number: 3, title: "Entry Rules" },
    { number: 4, title: "Winners" },
    { number: 5, title: "Review" },
  ];

  // Check contracts and wallet connection
  useEffect(() => {
    if (isWalletConnected && (!giveawayDistContract || !raynStableContract)) {
      initializeContracts();
    }
  }, [
    isWalletConnected,
    giveawayDistContract,
    raynStableContract,
    initializeContracts,
  ]);

  // Check token approval when amount changes
  useEffect(() => {
    const checkApproval = async () => {
      if (
        !raynStableContract ||
        !giveawayDistContract ||
        !account ||
        !prizeAmount
      ) {
        return;
      }

      try {
        const amountInWei = ethers.parseUnits(prizeAmount, 6);
        const giveawayContractAddress = await giveawayDistContract.getAddress();
        const currentAllowance = await raynStableContract.allowance(
          account,
          giveawayContractAddress
        );

        const isApproved = currentAllowance >= amountInWei;

        setTokenApproval((prev) => ({
          ...prev,
          isApproved,
          currentAllowance: currentAllowance.toString(),
          error: null,
        }));

        console.log(`💳 Token approval check:`);
        console.log(`   Amount needed: ${amountInWei.toString()}`);
        console.log(`   Current allowance: ${currentAllowance.toString()}`);
        console.log(`   Is approved: ${isApproved}`);
      } catch (error) {
        console.error("❌ Error checking token approval:", error);
        setTokenApproval((prev) => ({
          ...prev,
          error: "Unable to check token approval",
        }));
      }
    };

    if (prizeAmount) {
      const timeoutId = setTimeout(checkApproval, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [prizeAmount, raynStableContract, giveawayDistContract, account]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleApproveTokens = async () => {
    if (!raynStableContract || !giveawayDistContract || !prizeAmount) {
      return;
    }

    setTokenApproval((prev) => ({ ...prev, isApproving: true, error: null }));

    try {
      const amountInWei = ethers.parseUnits(prizeAmount, 6);
      const giveawayContractAddress = await giveawayDistContract.getAddress();

      console.log(`🔐 Requesting token approval for giveaway creation:`);
      console.log(
        `   Amount: ${prizeAmount} RAYNS (${amountInWei.toString()} wei)`
      );
      console.log(`   Spender: ${giveawayContractAddress}`);

      addNotification({
        type: "info",
        title: "Approval Required",
        message: "Please approve token spending in your wallet...",
      });

      const approveTx = await raynStableContract.approve(
        giveawayContractAddress,
        amountInWei
      );

      addNotification({
        type: "info",
        title: "Approval Pending",
        message: "Token approval submitted. Waiting for confirmation...",
      });

      await approveTx.wait();

      setTokenApproval((prev) => ({
        ...prev,
        isApproved: true,
        isApproving: false,
        currentAllowance: amountInWei.toString(),
      }));

      addNotification({
        type: "success",
        title: "Tokens Approved!",
        message: "You can now create your giveaway.",
      });

      console.log(`✅ Token approval successful for giveaway creation`);
    } catch (error: any) {
      console.error("❌ Token approval failed:", error);

      let errorMessage = "Token approval failed. Please try again.";
      if (error.code === 4001) {
        errorMessage = "Token approval was cancelled by user.";
      }

      setTokenApproval((prev) => ({
        ...prev,
        isApproving: false,
        error: errorMessage,
      }));

      addNotification({
        type: "error",
        title: "Approval Failed",
        message: errorMessage,
      });
    }
  };

  const handleCreate = async () => {
    if (!giveawayDistContract || !raynStableContract || !account) {
      addNotification({
        type: "error",
        title: "Wallet Not Connected",
        message: "Please connect your wallet and try again.",
      });
      return;
    }

    if (!tokenApproval.isApproved) {
      addNotification({
        type: "warning",
        title: "Approval Required",
        message: "Please approve tokens before creating the giveaway.",
      });
      return;
    }

    setIsCreating(true);
    setIsLoading(true);

    try {
      // Convert values for blockchain
      const amountInWei = ethers.parseUnits(prizeAmount, 6);
      const winnersCount = parseInt(numberOfWinners);
      const durationInSeconds =
        durationType === "hours"
          ? parseInt(duration) * 3600
          : parseInt(duration) * 86400;
      const endTime = Math.floor(Date.now() / 1000) + durationInSeconds;
      const tokenAddress = await raynStableContract.getAddress();

      console.log(`🚀 Creating giveaway with parameters:`);
      console.log(`   Token: ${tokenAddress}`);
      console.log(
        `   Total Amount: ${prizeAmount} RAYNS (${amountInWei.toString()} wei)`
      );
      console.log(`   Winners Count: ${winnersCount}`);
      console.log(
        `   End Time: ${endTime} (${new Date(endTime * 1000).toISOString()})`
      );
      console.log(`   Is Private: ${!isPublic}`);

      addNotification({
        type: "info",
        title: "Creating Giveaway",
        message: "Please confirm the transaction in your wallet...",
      });

      const createTx = await giveawayDistContract.createGiveaway(
        tokenAddress,
        amountInWei,
        winnersCount,
        endTime,
        !isPublic // Contract uses isPrivate parameter
      );

      addNotification({
        type: "info",
        title: "Transaction Submitted",
        message: "Your giveaway is being created on the blockchain...",
      });

      console.log(
        `⏳ Create giveaway transaction submitted. Hash: ${createTx.hash}`
      );

      const receipt = await createTx.wait();

      // Extract giveaway ID from transaction logs
      const giveawayCreatedEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = giveawayDistContract.interface.parseLog(log);
          return parsed?.name === "GiveawayCreated";
        } catch {
          return false;
        }
      });

      let giveawayId: string | null = null;
      if (giveawayCreatedEvent) {
        const parsed =
          giveawayDistContract.interface.parseLog(giveawayCreatedEvent);
        giveawayId = parsed?.args[0]?.toString();
        console.log(`🎉 Giveaway created successfully! ID: ${giveawayId}`);
      }

      addNotification({
        type: "success",
        title: "Giveaway Created!",
        message: `Your giveaway has been created successfully${
          giveawayId ? ` (ID: ${giveawayId})` : ""
        }`,
      });

      // Store giveaway data in localStorage for later reference
      const giveawayData = {
        id: giveawayId,
        creator: account,
        totalAmount: prizeAmount,
        winnersCount: numberOfWinners,
        endTime,
        isPrivate: !isPublic,
        requireFollow,
        requireShare,
        minAccountAge,
        createdAt: Date.now(),
        transactionHash: createTx.hash,
      };

      const existingGiveaways = JSON.parse(
        localStorage.getItem("userGiveaways") || "[]"
      );
      existingGiveaways.push(giveawayData);
      localStorage.setItem("userGiveaways", JSON.stringify(existingGiveaways));

      // Navigate to giveaway details
      if (giveawayId) {
        navigate(`/giveaway/${giveawayId}`);
      } else {
        navigate("/giveaway");
      }
    } catch (error: any) {
      console.error("❌ Giveaway creation failed:", error);

      let errorMessage = "Giveaway creation failed. Please try again.";

      if (error.code === 4001) {
        errorMessage = "Transaction was cancelled by user.";
      } else if (error.code === "CALL_EXCEPTION") {
        if (error.reason?.includes("total amount too small")) {
          errorMessage = "Prize amount is too small for the number of winners.";
        } else if (error.reason?.includes("insufficient allowance")) {
          errorMessage =
            "Insufficient token allowance. Please approve tokens again.";
        } else if (error.reason?.includes("transfer amount exceeds balance")) {
          errorMessage = "Insufficient balance to create this giveaway.";
        } else {
          errorMessage = `Creation failed: ${error.reason || error.message}`;
        }
      }

      addNotification({
        type: "error",
        title: "Creation Failed",
        message: errorMessage,
      });
    } finally {
      setIsCreating(false);
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return prizeAmount && Number(prizeAmount) > 0;
      case 2:
        return duration && Number(duration) > 0;
      case 3:
        return true;
      case 4:
        return numberOfWinners && Number(numberOfWinners) > 0;
      case 5:
        return tokenApproval.isApproved;
      default:
        return false;
    }
  };

  const getButtonText = () => {
    if (currentStep === 5) {
      if (isCreating) return "Creating...";
      if (!tokenApproval.isApproved) return "Approve Tokens First";
      return "Create Giveaway";
    }
    return "Continue";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] via-[#231036] to-[#191022] text-white">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-[#1a0b2e]/80 backdrop-blur-sm">
        <div className="mx-2 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate("/giveaway")}
                className="p-2 hover:bg-purple-900/30 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img
                src={Logo}
                alt="Rayn logo"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <span className="text-xl sm:text-2xl font-bold">Rayn</span>
            </div>
            <span className="text-gray-400 text-sm">Create Giveaway</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep === step.number
                        ? "bg-purple-600 text-white scale-110"
                        : currentStep > step.number
                        ? "bg-green-600 text-white"
                        : "bg-purple-900/40 text-gray-400"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs sm:text-sm ${
                      currentStep >= step.number
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      currentStep > step.number
                        ? "bg-green-600"
                        : "bg-purple-900/40"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-3xl p-8 border border-purple-700/30">
          {/* Step 1: Prize Amount */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Set Prize Amount</h2>
                <p className="text-gray-400">How much will you give away?</p>
              </div>
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium mb-3">
                  Prize Amount (RAYNS)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-400" />
                  <input
                    type="number"
                    value={prizeAmount}
                    onChange={(e) => setPrizeAmount(e.target.value)}
                    placeholder="100"
                    className="w-full bg-[#1e1533] border border-purple-900/50 rounded-2xl py-5 pl-14 pr-4 text-3xl font-bold text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors text-center"
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {["50", "100", "250"].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setPrizeAmount(amount)}
                      className="bg-purple-900/30 hover:bg-purple-800/40 py-3 rounded-xl font-semibold border border-purple-700/30 transition-all"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Duration */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Choose Duration</h2>
                <p className="text-gray-400">How long will the giveaway run?</p>
              </div>
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium mb-3">
                  Duration
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="7"
                      className="w-full bg-[#1e1533] border border-purple-900/50 rounded-2xl py-4 pl-12 pr-4 text-2xl font-bold text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors text-center"
                    />
                  </div>
                  <select
                    value={durationType}
                    onChange={(e) =>
                      setDurationType(e.target.value as "hours" | "days")
                    }
                    className="bg-[#1e1533] border border-purple-900/50 rounded-2xl px-4 text-white focus:outline-none focus:border-purple-600 transition-colors"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {[
                    { value: "1", type: "days" },
                    { value: "3", type: "days" },
                    { value: "7", type: "days" },
                    { value: "14", type: "days" },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => {
                        setDuration(preset.value);
                        setDurationType(preset.type as "hours" | "days");
                      }}
                      className="bg-purple-900/30 hover:bg-purple-800/40 py-3 rounded-xl font-semibold border border-purple-700/30 transition-all"
                    >
                      {preset.value} {preset.type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Entry Rules */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Set Entry Rules</h2>
                <p className="text-gray-400">
                  Who can participate in your giveaway?
                </p>
              </div>
              <div className="max-w-md mx-auto space-y-6">
                {/* Public/Private Toggle */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Giveaway Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setIsPublic(true)}
                      className={`py-4 rounded-xl font-semibold border transition-all ${
                        isPublic
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "bg-purple-900/30 border-purple-700/30 text-gray-400"
                      }`}
                    >
                      <Globe2 className="w-5 h-5 mx-auto mb-2" />
                      Public
                    </button>
                    <button
                      onClick={() => setIsPublic(false)}
                      className={`py-4 rounded-xl font-semibold border transition-all ${
                        !isPublic
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "bg-purple-900/30 border-purple-700/30 text-gray-400"
                      }`}
                    >
                      <Lock className="w-5 h-5 mx-auto mb-2" />
                      Private
                    </button>
                  </div>
                </div>

                {/* Entry Requirements */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium">
                    Entry Requirements (Optional)
                  </label>

                  <label className="flex items-center gap-3 p-4 rounded-xl bg-purple-900/20 border border-purple-700/30 cursor-pointer hover:bg-purple-900/30 transition-all">
                    <input
                      type="checkbox"
                      checked={requireFollow}
                      onChange={(e) => setRequireFollow(e.target.checked)}
                      className="w-5 h-5 rounded accent-purple-600"
                    />
                    <span>Require participants to follow you</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 rounded-xl bg-purple-900/20 border border-purple-700/30 cursor-pointer hover:bg-purple-900/30 transition-all">
                    <input
                      type="checkbox"
                      checked={requireShare}
                      onChange={(e) => setRequireShare(e.target.checked)}
                      className="w-5 h-5 rounded accent-purple-600"
                    />
                    <span>Require participants to share giveaway</span>
                  </label>

                  <div>
                    <label className="block text-sm mb-2">
                      Minimum Account Age (days)
                    </label>
                    <input
                      type="number"
                      value={minAccountAge}
                      onChange={(e) => setMinAccountAge(e.target.value)}
                      placeholder="0"
                      className="w-full bg-[#1e1533] border border-purple-900/50 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Number of Winners */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Number of Winners</h2>
                <p className="text-gray-400">
                  How many winners will you select?
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium mb-3">
                  Number of Winners
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-400" />
                  <input
                    type="number"
                    value={numberOfWinners}
                    onChange={(e) => setNumberOfWinners(e.target.value)}
                    placeholder="1"
                    className="w-full bg-[#1e1533] border border-purple-900/50 rounded-2xl py-5 pl-14 pr-4 text-3xl font-bold text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors text-center"
                  />
                </div>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {["1", "3", "5", "10"].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumberOfWinners(num)}
                      className="bg-purple-900/30 hover:bg-purple-800/40 py-3 rounded-xl font-semibold border border-purple-700/30 transition-all"
                    >
                      {num}
                    </button>
                  ))}
                </div>
                {Number(numberOfWinners) > 1 && Number(prizeAmount) > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-purple-600/20 border border-purple-500/30">
                    <p className="text-sm text-gray-300">
                      Each winner will receive approximately{" "}
                      <span className="font-bold text-purple-300">
                        $
                        {(
                          Number(prizeAmount) / Number(numberOfWinners)
                        ).toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Review & Create */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Review & Create</h2>
                <p className="text-gray-400">Review your giveaway details</p>
              </div>
              <div className="max-w-md mx-auto space-y-4">
                <div className="p-5 rounded-xl bg-purple-900/30 border border-purple-700/30">
                  <p className="text-sm text-gray-400 mb-1">Prize Amount</p>
                  <p className="text-3xl font-bold text-purple-300">
                    {prizeAmount} RAYNS
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-purple-900/30 border border-purple-700/30">
                  <p className="text-sm text-gray-400 mb-1">Duration</p>
                  <p className="text-xl font-bold">
                    {duration} {durationType}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-purple-900/30 border border-purple-700/30">
                  <p className="text-sm text-gray-400 mb-1">Type</p>
                  <p className="text-xl font-bold">
                    {isPublic ? "Public" : "Private"}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-purple-900/30 border border-purple-700/30">
                  <p className="text-sm text-gray-400 mb-1">Winners</p>
                  <p className="text-xl font-bold">
                    {numberOfWinners}{" "}
                    {Number(numberOfWinners) === 1 ? "winner" : "winners"}
                  </p>
                </div>

                {/* Token Approval Section */}
                {!isWalletConnected ? (
                  <div className="bg-red-900/40 border border-red-700/30 rounded-xl p-4 text-red-200 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    Please connect your wallet to create a giveaway
                  </div>
                ) : (
                  <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">
                        Token Approval
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          tokenApproval.isApproved
                            ? "bg-green-900/40 text-green-300"
                            : "bg-orange-900/40 text-orange-300"
                        }`}
                      >
                        {tokenApproval.isApproved ? "Approved" : "Required"}
                      </span>
                    </div>

                    {!tokenApproval.isApproved && (
                      <button
                        onClick={handleApproveTokens}
                        disabled={tokenApproval.isApproving}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
                      >
                        {tokenApproval.isApproving
                          ? "Approving..."
                          : `Approve ${prizeAmount} RAYNS`}
                      </button>
                    )}

                    {tokenApproval.error && (
                      <div className="text-red-400 text-xs mt-2">
                        {tokenApproval.error}
                      </div>
                    )}
                  </div>
                )}

                {(requireFollow ||
                  requireShare ||
                  Number(minAccountAge) > 0) && (
                  <div className="p-5 rounded-xl bg-purple-900/30 border border-purple-700/30">
                    <p className="text-sm text-gray-400 mb-2">Requirements</p>
                    <ul className="space-y-1 text-sm">
                      {requireFollow && <li>• Must follow you</li>}
                      {requireShare && <li>• Must share giveaway</li>}
                      {Number(minAccountAge) > 0 && (
                        <li>• Account age: {minAccountAge}+ days</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 bg-purple-900/40 hover:bg-purple-800/50 text-white font-semibold py-4 rounded-xl border border-purple-700/30 transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={currentStep === 5 ? handleCreate : handleNext}
            disabled={!canProceed() || isCreating}
            className={`flex-1 font-semibold py-4 rounded-xl transition-all ${
              canProceed() && !isCreating
                ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30 transform hover:scale-[1.02]"
                : "bg-gray-700/40 text-gray-500 cursor-not-allowed"
            }`}
          >
            {getButtonText()}
          </button>
        </div>
      </main>
    </div>
  );
}
