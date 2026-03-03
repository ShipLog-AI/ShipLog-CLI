"use strict";

const config = require("./config");

class ShipLogClient {
  constructor() {
    const cfg = config.load();
    this.baseUrl = (cfg.api_url || "https://shiplogs.ai").replace(/\/$/, "");
    this.apiKey = cfg.api_key || "";
  }

  /** @returns {HeadersInit} */
  headers(extra = {}) {
    const h = { "Content-Type": "application/json", ...extra };
    if (this.apiKey) h["Authorization"] = `Bearer ${this.apiKey}`;
    return h;
  }

  async request(method, path, body) {
    if (!this.apiKey) {
      console.error("✗ Not authenticated. Run: shiplog auth login");
      process.exit(1);
    }

    const url = `${this.baseUrl}/api${path}`;
    const opts = { method, headers: this.headers() };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    return data;
  }

  // ── Repos ─────────────────────────────────────────────
  listRepos() {
    return this.request("GET", "/v1/repos");
  }

  addRepo(fullName) {
    return this.request("POST", "/v1/repos", { repo: fullName });
  }

  removeRepo(id) {
    return this.request("DELETE", `/v1/repos?id=${id}`);
  }

  // ── Changelogs ────────────────────────────────────────
  listChangelog(repo, limit = 20) {
    return this.request("GET", `/v1/changelog?repo=${encodeURIComponent(repo)}&published=false&limit=${limit}`);
  }

  generateChangelog(repo, autoPublish = false) {
    return this.request("POST", "/v1/changelog", { repo, auto_publish: autoPublish });
  }

  getEntry(id) {
    return this.request("GET", `/v1/changelog/${id}`);
  }

  publishEntry(id, action = "publish") {
    return this.request("POST", `/v1/changelog/${id}/publish`, { action });
  }
}

module.exports = { ShipLogClient };
