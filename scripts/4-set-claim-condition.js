import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0xb2dFE2E9b7D8a9a159baeda836de4BfC6637F954");

(async () => {
  try {
    const claimConditions = [{
      // When people can drop yours NFTs.
      startTime: new Date(),
      // NFT Max Number
      maxQuantity: 50_000,
      // NFT Price
      price: 0,
      quantityLimitPerTransaction: 1,
      // infinite waiting time between transactions means that each person can only request a single invoice
      waitInSeconds: MaxUint256,
    }]
    
    await editionDrop.claimConditions.set("0", claimConditions);

    console.log("✅ Claim conditions set up successfully!");
  } catch (error) {
    console.error("Failed to set claim conditions", error);
  }
})()
