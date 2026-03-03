"use strict";

const readline = require("readline");
const config = require("../config");

module.exports = function registerAuth(cli) {
  const auth = cli.command("auth").description("Manage authentication");

  auth
    .command("login")
    .description("Authenticate with your ShipLog API key")
    .option("-k, --key <key>", "API key (sl_xxx)")
    .action(async (opts) => {
      let key = opts.key;

      if (!key) {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        key = await new Promise((resolve) => {
          rl.question("Enter your ShipLog API key (sl_xxx): ", (answer) => {
            rl.close();
            resolve(answer.trim());
          });
        });
      }

      if (!key || !key.startsWith("sl_")) {
        console.error('✗ Invalid API key. Keys start with "sl_".');
        process.exit(1);
      }

      config.set("api_key", key);
      console.log(`✓ API key saved to ${config.CONFIG_FILE}`);

      // Verify the key works
      try {
        const { ShipLogClient } = require("../client");
        const client = new ShipLogClient();
        const data = await client.listRepos();
        console.log(`✓ Authenticated. ${data.repos?.length || 0} repos connected.`);
      } catch (e) {
        console.warn(`⚠ Key saved but verification failed: ${e.message}`);
      }
    });

  auth
    .command("logout")
    .description("Clear stored credentials")
    .action(() => {
      config.set("api_key", "");
      console.log("✓ Credentials cleared.");
    });

  auth
    .command("whoami")
    .description("Show current authentication status")
    .action(async () => {
      const cfg = config.load();
      if (!cfg.api_key) {
        console.log("Not authenticated. Run: shiplog auth login");
        return;
      }
      console.log(`API URL: ${cfg.api_url}`);
      console.log(`API Key: ${cfg.api_key.slice(0, 7)}…${cfg.api_key.slice(-4)}`);

      try {
        const { ShipLogClient } = require("../client");
        const client = new ShipLogClient();
        const data = await client.listRepos();
        console.log(`Status:  ✓ Authenticated (${data.repos?.length || 0} repos)`);
      } catch (e) {
        console.log(`Status:  ✗ ${e.message}`);
      }
    });
};
