import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0xb2dFE2E9b7D8a9a159baeda836de4BfC6637F954");

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Grains",
        description: "With the grain you have access to Agro DAO",
        image: readFileSync("scripts/assets/grains.png"),
      },
    ]);
    console.log("✅ New NFT successfully created!");
  } catch (error) {
    console.error("error to create a new NFT", error);
  }
})()
