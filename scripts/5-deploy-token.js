import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // Deploy a ERC-20 contract.
    const tokenAddress = await sdk.deployer.deployToken({
      // Name Token"
      name: "Agro DAO governance token",
      symbol: "AGRO",
      // This is in case we want to sell the token, in which case we don't, so AddressZero again.
      primary_sale_recipient: AddressZero,
    });
    console.log(
      "✅ Token deployed. Address:",
      tokenAddress,
    );
  } catch (error) {
    console.error("Error to deploy token", error);
  }
})();
