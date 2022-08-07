import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      // Collection Infos
      name: "AGRODAO Collection",
      description: "A Decentralized Crowdfunding",
      image: readFileSync("scripts/assets/agro-dao-collection.png"),
      // We need to pass the address of the person who will be receiving the sales proceeds from the module's nfts.
      // We're planning to not charge people for the drop, so we'll pass the address 0x0
      // you can configure this for your own wallet if you want to charge for the drop.
      primary_sale_recipient: AddressZero,
    });

    // this initialization returns the address of our contract
    // we use it to initialize the contract in the sdk
    const editionDrop = sdk.getEditionDrop(editionDropAddress);

    // with this we have the metadata in our contract
    const metadata = await editionDrop.metadata.get();
    
    console.log(
      "✅ contract successfully deployed, address:",
      editionDropAddress,
    );
    console.log(
      "✅ bundleDrop metadata:",
      metadata,
    );
  } catch (error) {
    console.log("error to deploy", error);
  }
})()
