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
  const vote = useVote("0xa28c41d472BFE519670870F590603d0d01A38dF8")
  // Variável de estado para sabermos se o usuário tem nosso NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming nos ajuda a saber se está no estado de carregando enquanto o NFT é cunhado.
  const [isClaiming, setIsClaiming] = useState(false);
  // Guarda a quantidade de tokens que cada membro tem nessa variável de estado.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  // O array guardando todos os endereços dos nosso membros.
  const [memberAddresses, setMemberAddresses] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Uma função para diminuir o endereço da carteira de alguém, não é necessário mostrar a coisa toda.
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // Esse useEffect pega todos os endereços dos nosso membros detendo nosso NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    
    // Do mesmo jeito que fizemos no arquivo 7-airdrop-token.js! Pegue os usuários que tem nosso NFT
    // com o tokenId 0.
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("🚀 Endereços de membros", memberAddresses);
      } catch (error) {
        console.error("falha ao pegar lista de membros", error);
      }

    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  // Esse useEffect pega o # de tokens que cada membro tem.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Pega todos os saldos.
    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Quantidades", amounts);
      } catch (error) {
        console.error("falha ao buscar o saldo dos membros", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);


  // Agora, nós combinamos os memberAddresses e os memberTokenAmounts em um único array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // Se o endereço não está no memberTokenAmounts, isso significa que eles não
      // detêm nada do nosso token.
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // Se ele não tiver uma carteira conectada, saia!
    if (!address) {
      return
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0)
        // Se o saldo for maior do que 0, ele tem nosso NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true)
          console.log("🌟 esse usuário tem o NFT de membro!")
        } else {
          setHasClaimedNFT(false)
          console.log("😭 esse usuário NÃO tem o NFT de membro.")
        }
      } catch (error) {
        setHasClaimedNFT(false)
        console.error("Falha ao ler saldo", error)
      }
    }
    checkBalance()
  }, [address, editionDrop])

  // Recupere todas as propostas existentes no contrato. 
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // Uma chamada simples para vote.getAll() para pegar as propostas.
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("🌈 Propostas:", proposals);
      } catch (error) {
        console.log("falha ao buscar propostas", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  // Nós também precisamos checar se o usuário já votou.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Se nós não tivermos terminado de recuperar as propostas do useEffect acima
    // então ainda nao podemos checar se o usuário votou!
    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("🥵 Usuário já votou");
        } else {
          console.log("🙂 Usuário ainda não votou");
        }
      } catch (error) {
        console.error("Falha ao verificar se carteira já votou", error);
      }
    };
    checkIfUserHasVoted();

  }, [hasClaimedNFT, proposals, address, vote]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`🌊 Cunhado com sucesso! Olhe na OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Falha ao cunhar NFT", error);
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

                //before doing the async things, disable the button to prevent double click
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
                  // se a delegação é o endereço 0x0 significa que eles não delegaram seus tokens de governança ainda
                  if (delegation === AddressZero) {
                    //se não delegaram ainda, teremos que delegar eles antes de votar
                    await token.delegateTo(address)
                  }
                  // então precisamos votar nas propostas
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // antes de votar, precisamos saber se a proposta está aberta para votação
                        // pegamos o último estado da proposta
                        const proposal = await vote.get(proposalId)
                        // verifica se a proposta está aberta para votação (state === 1 significa está aberta)
                        if (proposal.state === 1) {
                          // se está aberta, então vota nela
                          return vote.vote(proposalId, _vote)
                        }
                        // se a proposta não está aberta, returna vazio e continua
                        return
                      })
                    )
                    try {
                      // se alguma proposta está pronta para ser executada, fazemos isso
                      // a proposta está pronta para ser executada se o estado é igual a 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // primeiro pegamos o estado da proposta novamente, dado que podemos ter acabado de votar
                          const proposal = await vote.get(proposalId)

                          //se o estado é igual a 4 (pronta para ser executada), executamos a proposta
                          if (proposal.state === 4) {
                            return vote.execute(proposalId)
                          }
                        })
                      )
                      // se chegamos aqui, significa que votou com sucesso, então definimos "hasVoted" como true
                      setHasVoted(true)
                      console.log("votado com sucesso")
                    } catch (err) {
                      console.error("falha ao executar votos", err)
                    }
                  } catch (err) {
                    console.error("falha ao votar", err)
                  }
                } catch (err) {
                  console.error("falha ao delegar tokens")
                } finally {
                  // de qualquer modo, volta isVoting para false para habilitar o botão novamente
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
                            //valor padrão "abster" vem habilitado
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
