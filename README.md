## Agro DAO - A Decentralized Crowdfunding
Join this DAO to be part of agribusiness investments.

### Summary

The contracts are built using thirdweb so we can write it using just javascript.

Contract ERC-1155 and NFT AGRO DAO Partner
https://rinkeby.etherscan.io/address/0xb2dfe2e9b7d8a9a159baeda836de4bfc6637f954
https://rinkeby.etherscan.io/token/0xb2dfe2e9b7d8a9a159baeda836de4bfc6637f954
https://testnets.opensea.io/assets/rinkeby/0xb2dfe2e9b7d8a9a159baeda836de4bfc6637f954/0

Token $AGRO ERC-20
https://rinkeby.etherscan.io/address/0xf08946d1ce150334e16eE62781a5B797756A9483


If you want deploy a new contract:

- Fill out .env;
- Node 12+ is mandatory;
- Run `node scripts/1-initialize-sdk.js`;
- Run `node scripts/2-deploy-drop.js`;
- Get the address of ERC-1155 contract in previous step and fill out on script number 3;
- Run `node scripts/3-config-nft.js`;
- Get the same address of ERC-1155 contract and fill out on script number 4;
- Run `node scripts/4-set-claim-condition.js`;
- Run `node scripts/5-deploy-token.js`;
- Get the address of ERC-20 contract in previous step and fill out on script number 6;
- Run `node scripts/6-print-money.js`;
- Fill out on script 7 the ERC-20 and ERC-1155 addresses;
- Run `node scripts/7-airdrop-token.js` to make the airdrop;

- Fill out the ERC-20 and ERC-1155 addresses on App.jsx;
- Run npm instal;l
- Run npm start.