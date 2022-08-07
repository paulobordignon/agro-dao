import { useState, useEffect, useMemo } from 'react';
import { useAddress, useMetamask, useEditionDrop, useToken } from '@thirdweb-dev/react';

const App = () => {
  // Thirdweb hooks.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);

  // ERC-1155 Address
  const editionDrop = useEditionDrop("0xb2dfe2e9b7d8a9a159baeda836de4bfc6637f954");
  // ERC-20 Address
  const token = useToken("0xf08946d1ce150334e16eE62781a5B797756A9483");
  // Variável de estado para sabermos se o usuário tem nosso NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming nos ajuda a saber se está no estado de carregando enquanto o NFT é cunhado.
  const [isClaiming, setIsClaiming] = useState(false);
  // Guarda a quantidade de tokens que cada membro tem nessa variável de estado.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  // O array guardando todos os endereços dos nosso membros.
  const [memberAddresses, setMemberAddresses] = useState([]);

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
        <div>
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
