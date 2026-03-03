"use strict";

const config = require("../config");

module.exports = function registerConfig(cli) {
  const cfg = cli.command("config").description("Manage CLI configuration");

  cfg
    .command("set")
    .description("Set a config value")
    .argument("<key>", "Config key (api_url, api_key)")
    .argument("<value>", "Config value")
    .action((key, value) => {
      const valid = ["api_url", "api_key"];
      if (!valid.includes(key)) {
        console.error(`✗ Unknown key "${key}". Valid keys: ${valid.join(", ")}`);
        process.exit(1);
      }
      config.set(key, value);
      console.log(`✓ ${key} = ${key === "api_key" ? value.slice(0, 7) + "…" : value}`);
    });

  cfg
    .command("get")
    .description("Get a config value")
    .argument("<key>", "Config key")
    .action((key) => {
      const val = config.get(key);
      if (val === undefined) {
        console.error(`✗ Unknown key "${key}"`);
        process.exit(1);
      }
      // Mask API key
      if (key === "api_key" && val) {
        console.log(`${key} = ${val.slice(0, 7)}…${val.slice(-4)}`);
      } else {
        console.log(`${key} = ${val}`);
      }
    });

  cfg
    .command("path")
    .description("Show config file path")
    .action(() => {
      console.log(config.CONFIG_FILE);
    });
};
