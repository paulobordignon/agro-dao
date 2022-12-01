import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// Voting Contract.
const vote = sdk.getVote("0xA195CaE00E3E5BACD52eA7065eb4A69811644B46");

// ERC-20.
const token = sdk.getToken("0x8C8157f04C2B4d47F9f498C4FBF0c37C613E5624");

(async () => {
  try {
    const amount = 420_000;
    // Create a proposal to mint 420,000 new tokens for the treasure.
    const description =
      "Mint for the DAO an additional amount of " + amount + " tokens?";

    const executions = [
      {
        toAddress: token.getAddress(),
        // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
        // send in this proposal. In this case, we are sending 0 ETH.
        // We're just minting new tokens for the treasure. So leave 0.
        nativeTokenValue: 0,
        // We're making a coinage! And, we are coining in the vote, which is
        // acting as our treasure.
        // in this case we use ethers.js to convert the amount
        // to the correct format. That's because the quantity needs to be in wei
        transactionData: token.encoder.encode("mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];

    await vote.propose(description, executions);

    console.log("✅ Proposal created successfully!");
  } catch (error) {
    console.error("Fail to create a proposal", error);
    process.exit(1);
  }

  try {
    // Create a proposal to transfer to ourselves 6,900 tokens.
    const amount = 6_900;

    const description =
      "The DAO should transfer " +
      amount +
      " tokens from treasure to " +
      process.env.WALLET_ADDRESS +
      "?";

    const executions = [
      {
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          // We are making a transfer from the treasury to our wallet.
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),

        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      "✅ Proposal to give treasure prize to yourself successfully created, let's hope you vote yes!"
    );
  } catch (error) {
    console.error("fail to create the second proposal", error);
  }
})();
