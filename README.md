# ShipLog CLI

Command-line interface for managing your ShipLog changelogs.

## Installation

```bash
npm install -g @shiplog/cli
```

Or run directly with npx:

```bash
npx @shiplog/cli --help
```

## Quick Start

```bash
# Authenticate with your API key
shiplog auth login

# List connected repos
shiplog repos list

# Add a new repo
shiplog repos add owner/repo

# Generate a changelog
shiplog changelog generate owner/repo

# Publish it
shiplog changelog publish <entry_id>
```

## Commands

### Authentication

| Command | Description |
|---------|-------------|
| `shiplog auth login` | Authenticate with API key (interactive or `--key`) |
| `shiplog auth logout` | Clear stored credentials |
| `shiplog auth whoami` | Show authentication status |

### Repositories

| Command | Description |
|---------|-------------|
| `shiplog repos list` | List connected repositories |
| `shiplog repos add <owner/repo>` | Connect a GitHub repository |
| `shiplog repos remove <id>` | Disconnect a repository |

### Changelogs

| Command | Description |
|---------|-------------|
| `shiplog changelog list <repo>` | List entries (use `-n` for limit) |
| `shiplog changelog generate <repo>` | Trigger AI generation (`--publish` to auto-publish) |
| `shiplog changelog publish <id>` | Publish an entry (`--unpublish` to revert) |
| `shiplog changelog view <id>` | View entry content in terminal |

### Configuration

| Command | Description |
|---------|-------------|
| `shiplog config set <key> <val>` | Set config (`api_url`, `api_key`) |
| `shiplog config get <key>` | Get config value |
| `shiplog config path` | Show config file path |

## Configuration

Config is stored at `~/.shiplog/config.json`:

```json
{
  "api_url": "https://shiplogs.ai",
  "api_key": "sl_your_api_key_here"
}
```

## API Key

API keys are available on Pro and Team plans. Create one in your ShipLog dashboard under **Settings → API Keys**.

## License

MIT