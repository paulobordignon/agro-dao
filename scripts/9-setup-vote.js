import sdk from "./1-initialize-sdk.js";

// Voting contract
const vote = sdk.getVote("0xa28c41d472BFE519670870F590603d0d01A38dF8");

// ERC-20
const token = sdk.getToken("0xf08946d1ce150334e16eE62781a5B797756A9483");

(async () => {
  try {
    // Give our treasury the power to mint additional tokens if needed.
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "✅  Votes module received permission to handle tokens successfully"
    );
  } catch (error) {
    console.error(
      "Failed to give access to tokens to votes module",
      error
    );
    process.exit(1);
  }

  try {
    // Take the token balance from our wallet, remember -- we basically own the entire supply now!
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Take 90% of the supply we hold.
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = Number(ownedAmount) / 100 * 90;

    // Transfer 90% of the supply to our voting contract.
    await token.transfer(
      vote.getAddress(),
      percent90
    ); 

    console.log("✅ Transfered " + percent90 + " tokens");
  } catch (err) {
    console.error("Fail to transfer tokens", err);
  }
})();
