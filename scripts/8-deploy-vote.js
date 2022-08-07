import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      // Governance contract.
      name: "Agro DAO - Voting Contract",

      // ERC-20 Address
      voting_token_address: "0xf08946d1ce150334e16eE62781a5B797756A9483",

      // After a proposal is created, when can members start voting? For now, we put this as immediately.
      voting_delay_in_blocks: 0,

      // How long can members vote on a proposal when it is created? Here, we set it to 1 day (6570 blocks)
      voting_period_in_blocks: 6570,

      // The minimum % of the total bid that needs to vote for the bid to be valid
      voting_quorum_fraction: 0,

      // What is the minimum # of tokens a user needs to be able to create a proposal?
      proposal_token_threshold: 0,
    });

    console.log(
      "✅ Voting module successfully deployed to address:",
      voteContractAddress,
    );
  } catch (err) {
    console.error("Failed to deploy votes module", err);
  }
})();
