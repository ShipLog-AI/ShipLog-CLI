"use strict";

const { ShipLogClient } = require("../client");

module.exports = function registerChangelog(cli) {
  const changelog = cli.command("changelog").description("Manage changelogs");

  changelog
    .command("list")
    .description("List changelog entries for a repo")
    .argument("<repo>", "Repository full name (owner/repo)")
    .option("-n, --limit <n>", "Max entries", "20")
    .action(async (repo, opts) => {
      try {
        const client = new ShipLogClient();
        const data = await client.listChangelog(repo, parseInt(opts.limit));
        const entries = data.entries || [];

        if (entries.length === 0) {
          console.log(`No changelog entries for ${repo}.`);
          console.log(`Generate one with: shiplog changelog generate ${repo}`);
          return;
        }

        console.log(`\n  Changelogs for ${repo} (${entries.length})\n`);
        for (const e of entries) {
          const status = e.is_published ? "✓ published" : "  draft";
          const date = (e.published_at || e.created_at || "").slice(0, 10);
          console.log(`  [${status}]  ${e.title}`);
          console.log(`             ID: ${e.id}  |  ${e.version || "—"}  |  ${date}`);
          console.log();
        }
      } catch (e) {
        console.error(`✗ ${e.message}`);
        process.exit(1);
      }
    });

  changelog
    .command("generate")
    .description("Trigger changelog generation")
    .argument("<repo>", "Repository full name (owner/repo)")
    .option("--publish", "Auto-publish after generation", false)
    .action(async (repo, opts) => {
      try {
        console.log(`⏳ Generating changelog for ${repo}...`);
        const client = new ShipLogClient();
        const data = await client.generateChangelog(repo, opts.publish);
        const result = data.result || {};
        console.log(`✓ Generated: ${result.title || "changelog"}`);
        if (result.entry_id) console.log(`  Entry ID: ${result.entry_id}`);
        if (!opts.publish) console.log(`  Run "shiplog changelog publish ${result.entry_id}" to publish.`);
      } catch (e) {
        console.error(`✗ ${e.message}`);
        process.exit(1);
      }
    });

  changelog
    .command("publish")
    .description("Publish a changelog entry")
    .argument("<id>", "Entry ID")
    .option("--unpublish", "Unpublish instead", false)
    .action(async (id, opts) => {
      try {
        const action = opts.unpublish ? "unpublish" : "publish";
        const client = new ShipLogClient();
        const data = await client.publishEntry(id, action);
        console.log(`✓ ${data.action}: ${data.entry.title}`);
      } catch (e) {
        console.error(`✗ ${e.message}`);
        process.exit(1);
      }
    });

  changelog
    .command("view")
    .description("View a changelog entry in the terminal")
    .argument("<id>", "Entry ID")
    .action(async (id) => {
      try {
        const client = new ShipLogClient();
        const data = await client.getEntry(id);
        const entry = data.entry;

        console.log(`\n  ${entry.title}`);
        if (entry.version) console.log(`  Version: ${entry.version}`);
        console.log(`  Status:  ${entry.is_published ? "Published" : "Draft"}`);
        console.log(`  Repo:    ${entry.full_name}`);
        console.log(`  Date:    ${(entry.published_at || entry.created_at || "").slice(0, 10)}`);
        console.log(`\n${"─".repeat(60)}\n`);
        console.log(entry.content);
        console.log(`\n${"─".repeat(60)}`);
      } catch (e) {
        console.error(`✗ ${e.message}`);
        process.exit(1);
      }
    });
};
