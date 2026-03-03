"use strict";

const { Command } = require("commander");
const pkg = require("../package.json");

const cli = new Command();

cli
  .name("shiplog")
  .description("ShipLog CLI — manage changelogs from your terminal")
  .version(pkg.version);

// Register command groups
require("./commands/auth")(cli);
require("./commands/repos")(cli);
require("./commands/changelog")(cli);
require("./commands/configure")(cli);

module.exports = { cli };
