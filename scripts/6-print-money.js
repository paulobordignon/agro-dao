import sdk from "./1-initialize-sdk.js";

// contract ERC-20 address.
const token = sdk.getToken("0xf08946d1ce150334e16eE62781a5B797756A9483");

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
