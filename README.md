## Agro DAO - A Decentralized Crowdfunding
Join this DAO to be part of agribusiness investments.

### Summary

The contracts are built using thirdweb so we can write it using just javascript.

If you want deploy a new contract:

- Fill out .env;
- Node 12+ is mandatory.
- Run node scripts/1-initialize-sdk.js;
- Run node scripts/2-deploy-drop.js;
- Get the address of ERC-1155 contract in previous step and fill out on script number 3;
- Run node scripts/3-config-nft.js
- Get the same address of ERC-1155 contract and fill out on script number 4;