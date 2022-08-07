import sdk from "./1-initialize-sdk.js";

// ERC 20
const token = sdk.getToken("0xf08946d1ce150334e16eE62781a5B797756A9483");

(async () => {
  try {
    // Show current roles.
    const allRoles = await token.roles.getAll();

    console.log("👀 Roles now:", allRoles);

    // Remove you wallet privileges
    await token.roles.setAll({ admin: [], minter: [] });
    console.log(
      "🎉 Roles after remove my wallet",
      await token.roles.getAll()
    );
    console.log("✅ Revoke my privileges");

  } catch (error) {
    console.error("Fail to remove my wallet privileges", error);
  }
})();
