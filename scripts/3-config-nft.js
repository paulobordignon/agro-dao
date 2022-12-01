import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop(
  "0x8E970a8e599B14f20411C8A5E06899bd9Ff4C9e3"
);

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
})();
