"use strict";

const { ShipLogClient } = require("../client");

module.exports = function registerRepos(cli) {
  const repos = cli.command("repos").description("Manage connected repositories");

  repos
    .command("list")
    .description("List connected repositories")
    .action(async () => {
      try {
        const client = new ShipLogClient();
        const data = await client.listRepos();
        const list = data.repos || [];

        if (list.length === 0) {
          console.log("No repos connected. Run: shiplog repos add <owner/repo>");
          return;
        }

        console.log(`\n  Connected Repositories (${list.length})\n`);
        for (const r of list) {
          const sched = r.schedule_frequency === "none" ? "manual" : r.schedule_frequency;
          console.log(`  ${r.full_name}`);
          console.log(`    ID:       ${r.id}`);
          console.log(`    Schedule: ${sched}${r.schedule_auto_publish ? " (auto-publish)" : ""}`);
          console.log();
        }
      } catch (e) {
        console.error(`✗ ${e.message}`);
        process.exit(1);
      }
    });

  repos
    .command("add")
    .description("Connect a GitHub repository")
    .argument("<repo>", "Repository full name (owner/repo)")
    .action(async (repo) => {
      try {
        const client = new ShipLogClient();
        const data = await client.addRepo(repo);
        console.log(`✓ Connected: ${data.repo.full_name} (id: ${data.repo.id})`);
      } catch (e) {
        console.error(`✗ ${e.message}`);
        process.exit(1);
      }
    });

  repos
    .command("remove")
    .description("Disconnect a repository")
    .argument("<id>", "Repository ID (from 'shiplog repos list')")
    .action(async (id) => {
      try {
        const client = new ShipLogClient();
        const data = await client.removeRepo(id);
        console.log(`✓ Removed: ${data.removed.full_name}`);
      } catch (e) {
        console.error(`✗ ${e.message}`);
        process.exit(1);
      }
    });
};
