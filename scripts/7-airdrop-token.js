import sdk from "./1-initialize-sdk.js";

// ERC-1155 address.
const editionDrop = sdk.getEditionDrop(
  "0x8E970a8e599B14f20411C8A5E06899bd9Ff4C9e3"
);

// ERC-20 address.
const token = sdk.getToken("0x8C8157f04C2B4d47F9f498C4FBF0c37C613E5624");

(async () => {
  try {
    // Take the address of all the people who have our affiliation NFT which has the tokenId 0.
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      console.log("Nobody minted the NFT.");
      process.exit(0);
    }

    // loop in address array.
    const airdropTargets = walletAddresses.map((address) => {
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000
      );
      console.log("✅ We'll send", randomAmount, "tokens for ", address);

      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    // Call transferBatch on all airdrop targets.
    console.log("🌈 Starting airdrop...");
    await token.transferBatch(airdropTargets);
    console.log("✅ Airdrop has been finalized to all nft owners.");
  } catch (err) {
    console.error("Airdrop fail", err);
  }
})();
