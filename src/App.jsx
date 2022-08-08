import { useState, useEffect, useMemo } from 'react';
import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/sdk'
import { AddressZero } from "@ethersproject/constants";

const App = () => {
  // Thirdweb hooks.
  const address = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);

  // ERC-1155 Address
  const editionDrop = useEditionDrop("0xb2dfe2e9b7d8a9a159baeda836de4bfc6637f954");
  // ERC-20 Address
  const token = useToken("0xf08946d1ce150334e16eE62781a5B797756A9483");
  // Voting contract address
  const vote = useVote("0xa28c41d472BFE519670870F590603d0d01A38dF8")
  // User have NFT?
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  // Token amount per partner
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  // All partner addresses
  const [memberAddresses, setMemberAddresses] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("🚀 Partners Addresses", memberAddresses);
      } catch (error) {
        console.error("fail to get partners list", error);
      }

    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Quantity", amounts);
      } catch (error) {
        console.error("fail to get partners amount", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    if (!address) {
      return
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0)
        if (balance.gt(0)) {
          setHasClaimedNFT(true)
          console.log("🌟 this user have the partner NFT!")
        } else {
          setHasClaimedNFT(false)
          console.log("😭 this user doesn't have the partner NFT.")
        }
      } catch (error) {
        setHasClaimedNFT(false)
        console.error("Fail to read", error)
      }
    }
    checkBalance()
  }, [address, editionDrop])

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // vote.getAll() to get all proposals.
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("🌈 Proposals:", proposals);
      } catch (error) {
        console.log("fail to find the proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  // Check if user has already voted
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("🥵 User has already voted");
        } else {
          console.log("🙂 User didn't vote");
        }
      } catch (error) {
        console.error("Fail to verify vote", error);
      }
    };
    checkIfUserHasVoted();

  }, [hasClaimedNFT, proposals, address, vote]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`🌊 Mint success: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Fail to mint the NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  if (address && (network?.[0].data.chain.id !== ChainId.Rinkeby)) {
    return (
      <div className="unsupported-network">
        <h2>Please, connect on rinkeby network</h2>
        <p>
          This dapp only works with the Rinkeby network,
          please switch networks in your wallet.
        </p>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to Agro DAO</h1>
        <h2>A Decentralized Crowdfunding</h2>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect Wallet
        </button>
      </div>
    )
  }

   if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>Agro DAO Partners</h1>
        <h2>Welcome to the partners page.</h2>
        <div style={{marginTop: '4rem'}}>
          <div>
            <h2>Partners List:</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Tokens Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                e.stopPropagation()

                // before doing the async things, disable the button to prevent double click
                setIsVoting(true)

                // take the votes in the form
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    // abstention is the default choice
                    vote: 2,
                  }
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    )

                    if (elem.checked) {
                      voteResult.vote = vote.type
                      return
                    }
                  })
                  return voteResult
                })

                // we make sure the user delegates their tokens for the vote
                try {
                  // checks if the wallet needs to delegate tokens before voting
                  const delegation = await token.getDelegationOf(address)
                  if (delegation === AddressZero) {
                    await token.delegateTo(address)
                  }

                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        const proposal = await vote.get(proposalId)
                        if (proposal.state === 1) {
                          return vote.vote(proposalId, _vote)
                        }
                        return
                      })
                    )
                    try {
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          const proposal = await vote.get(proposalId)

                          if (proposal.state === 4) {
                            return vote.execute(proposalId)
                          }
                        })
                      )
                      setHasVoted(true)
                      console.log("successfully voted")
                    } catch (err) {
                      console.error("fail to execute the vote", err)
                    }
                  } catch (err) {
                    console.error("fail to vote", err)
                  }
                } catch (err) {
                  console.error("token delegate failed")
                } finally {
                  setIsVoting(false)
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => {
                      const translations = {
                        Against: "Against",
                        For: "In Favor",
                        Abstain: "Abstention",
                      }
                      return (
                        <div key={type}>
                          <input
                            type="radio"
                            id={proposal.proposalId + "-" + type}
                            name={proposal.proposalId}
                            value={type}
                            defaultChecked={type === 2}
                          />
                          <label htmlFor={proposal.proposalId + "-" + type}>
                            {translations[label]}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You have already voted"
                    : "Submit votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will submit several transactions that you will need to sign.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mint-nft">
      <h1>Mint NFT</h1>
      <button
        disabled={isClaiming}
        onClick={mintNft}
      >
        {isClaiming ? "Minting..." : "Mint your NFT (FREE)"}
      </button>
    </div>
  );
};

export default App;
