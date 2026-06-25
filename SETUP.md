# SETUP.md

# Hands-on Session Setup

This guide describes the complete setup for the hands-on session with Claude Code and Privatemode AI. Claude Code is an agentic AI coding tool that understands a codebase and autonomously plans and executes multi-step tasks like editing files, running tests, and implementing features from natural language instructions. Privatemode AI serves as a model provider that ensures data security and privacy by encrypting the data before they leave the device.

This project is a NestJS Appointment API that serves as a simple entry point to AI based software engeneering. The goal is to run the backend locally, open Swagger, and use Claude Code inside VS Code to implement a small backend feature.

## 1. Assumptions

The following tools should already be installed before starting this setup:

- Visual Studio Code with Claude Code extension
- Docker or Rancher Desktop
- Node.js
- Git

If Node.js and npm are not installed the installation is explained in section 6.

## 2. Start the Privatemode Proxy

Claude Code will connect to Privatemode through a local proxy running on port `8080`.

Start the proxy with Docker or Rancher Desktop:

```bash
docker run -p 8080:8080 ghcr.io/edgelesssys/privatemode/privatemode-proxy:latest --apiKey <your-api-key> --sharedPromptCache
```

Replace `<your-api-key>` with your Privatemode API key.

Keep this terminal running while using Claude Code.

## 4. Configure Claude Code in VS Code

This is the primary setup path for the workshop.

The configuration is added to the VS Code user `settings.json` so that the Claude Code extension uses the local Privatemode proxy.

### 4.1 Open VS Code User Settings JSON

In VS Code:

1. Open the Command Palette:
   - Windows/Linux: `Ctrl+Shift+P`
   - macOS: `Cmd+Shift+P`
2. Search for:

```txt
Preferences: Open User Settings (JSON)
```

3. Open the file.

### 4.2 Add Claude Code configuration

Add the following block to your VS Code user `settings.json`:

```json
{
  "claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_BASE_URL", "value": "http://localhost:8080" },
    { "name": "ANTHROPIC_API_KEY", "value": "sk-privatemode" },
    { "name": "ANTHROPIC_MODEL", "value": "kimi-latest" },
    { "name": "CLAUDE_CODE_ATTRIBUTION_HEADER", "value": "0" },
    { "name": "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC", "value": "1" }
  ]
}
```

If your `settings.json` already contains other settings, do not paste a second top-level `{ ... }` object. Merge the keys into the existing JSON object.

Example with existing settings:

```json
{
  "editor.formatOnSave": true,
  "claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_BASE_URL", "value": "http://localhost:8080" },
    { "name": "ANTHROPIC_API_KEY", "value": "sk-privatemode" },
    { "name": "ANTHROPIC_MODEL", "value": "kimi-latest" },
    { "name": "CLAUDE_CODE_ATTRIBUTION_HEADER", "value": "0" },
    { "name": "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC", "value": "1" }
  ]
}
```

### 4.3 Restart VS Code

After saving the settings:

1. Close VS Code completely.
2. Open VS Code again.
3. Open the Claude Code panel.
4. Send a small test prompt:

```txt
Reply with OK only.
```

If Claude responds, the VS Code extension is connected.

## 5. Set Up the Project

Clone the repository:

```bash
git clone https://github.com/JoelHintz/appointment-api.git
cd appointment-api
```

Install project dependencies:

```bash
npm ci
```

If `npm ci` fails because the lockfile is missing or incompatible, use:

```bash
npm install
```

Start the NestJS API:

```bash
npm run start:dev
```

Open Swagger:

```txt
http://localhost:3000/api
```

The API should now be running locally.

## 6. Use Claude Code for the Hands-On Task

The repository contains a prepared prompt for the student task:

```txt
prompts/availability-endpoint.prompt.md
```

In VS Code Claude Code panel, use:

```txt
Use @prompts/availability-endpoint.prompt.md and implement the task.
```

Recommended workflow:

1. Ask Claude to inspect the project first.
2. Let Claude propose a short plan.
3. Review the plan.
4. Let Claude implement the change.
5. Run tests.
6. Verify the endpoint in Swagger.

Useful commands:

```bash
npm run test
npm run test:e2e
npm run lint
```

If a command does not exist, check `package.json` first.

## 6. Optional Node.js and npm installation guide

Node.js includes npm. You do not need to install npm separately.

Recommended version for this workshop:

```txt
Node.js LTS
npm bundled with Node.js
```

After installation, always verify:

```bash
node -v
npm -v
```

Both commands must print a version number.

---

## 6.1 Windows

### Recommended simple setup

1. Open the official Node.js download page.
2. Download the **LTS** Windows installer.
3. Run the installer.
4. Keep the default options.
5. Make sure Node.js is added to `PATH`.
6. Open a new PowerShell window.
7. Verify the installation:

```powershell
node -v
npm -v
```

### Alternative with winget

If winget is available:

```powershell
winget install OpenJS.NodeJS.LTS
```

Then open a new PowerShell window and verify:

```powershell
node -v
npm -v
```

---

## 6.2 macOS

### Option A: Official installer

1. Open the official Node.js download page.
2. Download the **LTS** macOS installer.
3. Run the installer.
4. Open a new terminal.
5. Verify:

```bash
node -v
npm -v
```

### Option B: nvm

If you already use `nvm`, install the latest LTS version:

```bash
nvm install --lts
nvm use --lts
node -v
npm -v
```

---

## 6.3 Linux

### Option A: nvm

If you already use `nvm`, install the latest LTS version:

```bash
nvm install --lts
nvm use --lts
node -v
npm -v
```

### Option B: Distribution package manager

Depending on your Linux distribution, install Node.js through your package manager or a NodeSource installer.

After installation, verify:

```bash
node -v
npm -v
```

## 7. Claude Code Backup Path: Global CLI

Use this path only if the VS Code extension setup does not work or if you want to run Claude Code from the terminal.

### 7.1 Install Claude Code globally

```bash
npm install -g @anthropic-ai/claude-code
```

Verify:

```bash
claude --version
```

### 7.2 Configure Claude Code user settings

Create or edit the Claude Code user settings file.

macOS/Linux:

```txt
~/.claude/settings.json
```

Windows:

```txt
C:\Users\<your-user>\.claude\settings.json
```

Content:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:8080",
    "ANTHROPIC_API_KEY": "sk-privatemode",
    "ANTHROPIC_MODEL": "kimi-latest",
    "CLAUDE_CODE_ATTRIBUTION_HEADER": "0",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

### 7.3 Start Claude Code from the project folder

```bash
cd appointment-api
claude --model kimi-latest
```

### 7.4 Sign in on Claude Code start (optional)

If Claude Code asks for sign-in even though the proxy configuration is correct, create or edit .claude.json:

Windows:

```txt
C:\Users\<your-user>\.claude.json
```

macOS/Linux:

```txt
~/.claude.json
```

Add or merge:

```json
{
  "hasCompletedOnboarding": true,
  "primaryApiKey": "sk-privatemode"
}
```

## 8. Troubleshooting

### `node` or `npm` is not recognized

- Restart the terminal.
- Check that Node.js was added to `PATH`.
- Reinstall Node.js LTS if needed.

### `npm ci` fails

Use the fallback:

```bash
npm install
```

### Claude Code does not use Privatemode

Check:

- The Privatemode proxy is running.
- The proxy uses port `8080`.
- `ANTHROPIC_BASE_URL` is exactly `http://localhost:8080`.
- VS Code was restarted after editing `settings.json`.
- There are no leading or trailing spaces in the URL or values.

### Docker cannot reach port 8080 on Windows

If Docker networking causes problems on Windows, try running the proxy through WSL or check the Rancher/Docker networking settings.

### Swagger does not open

Check that the NestJS app is running:

```bash
npm run start:dev
```

Then open:

```txt
http://localhost:3000/api
```

## References

Node.js. (n.d.). _Download Node.js®_. Node.js. Retrieved June 25, 2026, from [https://nodejs.org/en/download](https://nodejs.org/en/download)

npm, Inc. (n.d.). _Downloading and installing Node.js and npm_. npm Docs. Retrieved June 25, 2026, from [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)

Edgeless Systems. (n.d.). _API quickstart_. Privatemode Documentation. Retrieved June 25, 2026, from [https://docs.privatemode.ai/getting-started/proxy-api/](https://docs.privatemode.ai/getting-started/proxy-api/)

Edgeless Systems. (n.d.). _Claude Code_. Privatemode Documentation. Retrieved June 25, 2026, from [https://docs.privatemode.ai/guides/coding-assistants-claude-code/](https://docs.privatemode.ai/guides/coding-assistants-claude-code/)

Anthropic. (n.d.). _Environment variables_. Claude Code Docs. Retrieved June 25, 2026, from [https://code.claude.com/docs/en/env-vars](https://code.claude.com/docs/en/env-vars)

Anthropic. (n.d.). _Claude Code settings_. Claude Code Docs. Retrieved June 25, 2026, from [https://code.claude.com/docs/en/settings](https://code.claude.com/docs/en/settings)

Lumecoder. (n.d.). _How to Use Claude Code in VS Code: Extension Setup and Configuration Guide_. Lumecoder Guides. Retrieved June 25, 2026, from [https://lumecoder.com/guides/vscode-claude-code](https://lumecoder.com/guides/vscode-claude-code)
