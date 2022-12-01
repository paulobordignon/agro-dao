import sdk from "./1-initialize-sdk.js";

// ERC 20
const token = sdk.getToken("0x8C8157f04C2B4d47F9f498C4FBF0c37C613E5624");

(async () => {
  try {
    // Show current roles.
    const allRoles = await token.roles.getAll();

    console.log("👀 Roles now:", allRoles);

    // Remove you wallet privileges
    await token.roles.setAll({ admin: [], minter: [] });
    console.log("🎉 Roles after remove my wallet", await token.roles.getAll());
    console.log("✅ Revoke my privileges");
  } catch (error) {
    console.error("Fail to remove my wallet privileges", error);
  }
})();
