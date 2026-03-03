"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const CONFIG_DIR = path.join(os.homedir(), ".shiplog");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

const DEFAULTS = {
  api_url: "https://shiplogs.ai",
  api_key: "",
};

function load() {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, "utf8");
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

function save(cfg) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2) + "\n", "utf8");
}

function get(key) {
  const cfg = load();
  return cfg[key];
}

function set(key, value) {
  const cfg = load();
  cfg[key] = value;
  save(cfg);
}

module.exports = { load, save, get, set, CONFIG_FILE };
