import sdk from "./1-initialize-sdk.js";

// contract ERC-20 address.
const token = sdk.getToken("0x8C8157f04C2B4d47F9f498C4FBF0c37C613E5624");

(async () => {
  try {
    // Token max amount 1,000,000.
    const amount = 1_000_000;
    // mint ERC-20 tokens!
    await token.mintToSelf(amount);
    const totalSupply = await token.totalSupply();

    // show supply!
    console.log("✅ Now we have", totalSupply.displayValue, "$AGRO supply");
  } catch (error) {
    console.error("Error to show supply", error);
  }
})();
