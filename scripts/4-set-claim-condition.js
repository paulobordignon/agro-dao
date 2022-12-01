import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop(
  "0x8E970a8e599B14f20411C8A5E06899bd9Ff4C9e3"
);

(async () => {
  try {
    const claimConditions = [
      {
        // When people can drop yours NFTs.
        startTime: new Date(),
        // NFT Max Number
        maxQuantity: 50_000,
        // NFT Price
        price: 0,
        quantityLimitPerTransaction: 1,
        // infinite waiting time between transactions means that each person can only request a single invoice
        waitInSeconds: MaxUint256,
      },
    ];

    await editionDrop.claimConditions.set("0", claimConditions);

    console.log("✅ Claim conditions set up successfully!");
  } catch (error) {
    console.error("Failed to set claim conditions", error);
  }
})();
