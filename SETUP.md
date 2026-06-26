# Setup Claude Code with Privatemode AI

This guide describes the setup for the hands-on part of the lecture.

In the session, you will work with a small NestJS Appointment API. The backend runs locally, exposes its endpoints through Swagger, and serves as a compact example for AI-assisted software engineering. The goal is to use Claude Code inside VS Code to understand the existing project and implement a small backend feature with support from an agentic coding assistant.

Claude Code is used through the VS Code extension. Privatemode AI is used as the model provider through a local proxy running on your machine.

## 1. Required Software

Install the following tools before the session:

| Tool                              | Why it is needed                                                                           | Installation guide                                                                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual Studio Code                | Editor used for the hands-on session and Claude Code extension.                            | [Install VS Code](https://code.visualstudio.com/docs/getstarted/overview)                                                                             |
| Claude Code VS Code extension     | Provides Claude Code directly inside VS Code.                                              | [Claude Code for VS Code](https://code.claude.com/docs/en/vs-code)                                                                                    |
| Git                               | Required to clone the Appointment API repository.                                          | [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)                                                                          |
| Node.js LTS and npm               | Required to install dependencies and run the NestJS backend. npm is included with Node.js. | [Download Node.js](https://nodejs.org/en/download)                                                                                                    |
| Docker Desktop or Rancher Desktop | Required to run the local Privatemode proxy container.                                     | [Install Docker Desktop](https://docs.docker.com/desktop/) or [install Rancher Desktop](https://docs.rancherdesktop.io/getting-started/installation/) |

You will also need a Privatemode API key. The key will be provided during the session.

## 2. Install Git

Git is used to clone the prepared Appointment API repository and work with the code locally.

Install Git from the official guide:

- [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Verify Installation

Open a terminal and run:

```bash
git --version
```

If a version number is shown, Git is installed correctly.

### Common Pitfall

On Windows, make sure Git is available in your `PATH`; otherwise, the `git` command may not work in VS Code or in your terminal.

## 3. Install Docker Desktop or Rancher Desktop

Docker Desktop and Rancher Desktop allow you to run containers locally. For this workshop, this is only needed to start the Privatemode proxy.

The project was primarily tested with Rancher Desktop, but Docker Desktop should work as well.

### 3.1 Installation

Choose one of the following tools:

- [Install Docker Desktop](https://docs.docker.com/desktop/)
- [Install Rancher Desktop](https://docs.rancherdesktop.io/getting-started/installation/)

After installation:

1. Start Docker Desktop or Rancher Desktop.
2. Wait until the application reports that it is running.
3. Verify the Docker command:

```bash
docker --version
```

### 3.2 Important Requirements

On Windows, Docker Desktop and Rancher Desktop usually require WSL 2 for Linux containers. You can install WSL in powershell using the command `wsl --install`. Hardware virtualization must also be enabled in BIOS/UEFI.

You do not need deeper Docker knowledge for this workshop. Docker is only used to run one local proxy container.

## 4. Install Node.js and npm

Node.js is required to run the NestJS backend. npm is used to install the project dependencies and is included with Node.js.

Install the current Node.js LTS version:

- [Download Node.js](https://nodejs.org/en/download)

For this workshop, the official installer is sufficient on Windows and macOS. If you already use a Node version manager such as `nvm`, you can use it instead.

### Verify Installation

Open a terminal and run:

```bash
node -v
npm -v
```

Both commands should print a version number.

## 5. Install and Configure Claude Code in VS Code

The primary way to use Claude Code in this workshop is through the Claude Code extension in VS Code. This keeps the setup simple because you can work directly inside the editor.

### 5.1 Install the Claude Code Extension

1. Open VS Code.
2. Open the Extensions view:
   - Windows/Linux: `Ctrl+Shift+X`
   - macOS: `Cmd+Shift+X`
3. Search for `Claude Code`.
4. Install the official extension by Anthropic.
5. Restart VS Code if the Claude Code panel does not appear.

Installation guide:

- [Claude Code for VS Code](https://code.claude.com/docs/en/vs-code)

### 5.2 Open VS Code User Settings JSON

The Claude Code extension must be configured to use the local Privatemode proxy.

In VS Code:

1. Open the Command Palette:
   - Windows/Linux: `Ctrl+Shift+P`
   - macOS: `Cmd+Shift+P`
2. Search for `Preferences: Open User Settings (JSON)`.
3. Open the file.

### 5.3 Add Claude Code Configuration

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

If your `settings.json` already contains other settings, merge the `claudeCode.environmentVariables` entry into the existing JSON object. Do not create a second top-level JSON object.

Restart VS Code after changing the settings.

At this point, the extension is configured, but it will only work after the Privatemode proxy has been started.

## 6. Set Up the Project

The project is a small NestJS Appointment API with Swagger documentation for testing the endpoints in the browser.

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

- [Swagger UI](http://localhost:3000/api)

The API should now be running locally. You can test endpoints by expanding an endpoint in Swagger and clicking **Try it out**.

## 7. Start the Privatemode Proxy

This step requires a Privatemode API key, which will be provided during the session. As a result, you will not be able to test the proxy connection at home. The setup will be completed at the start of the session.

Claude Code connects to Privatemode through a local proxy running on port `8080`. Start Docker Desktop or Rancher Desktop first, then run:

```bash
docker run -p 8080:8080 ghcr.io/edgelesssys/privatemode/privatemode-proxy:latest --apiKey <your-api-key> --sharedPromptCache
```

Replace `<your-api-key>` with the API key provided in the session.

The proxy listens on http://localhost:8080.

After the proxy is running, test Claude Code in the VS Code panel with a short prompt:

```text
Hello Claude!
```

If Claude responds, the AI setup is working.

## 8. Final Setup Checklist

Use this checklist to prepare at home before the session. The project and local tools can be prepared in advance, but the full Claude Code connection requires the Privatemode API key, which will be provided during the session.

### Can be checked before the session

1. VS Code starts correctly.
2. The Claude Code extension is installed.
3. `git --version` prints a version number.
4. `node -v` and `npm -v` print version numbers.
5. Docker Desktop or Rancher Desktop starts correctly.
6. `docker --version` prints a version number.
7. The Appointment API can be installed with `npm ci` or `npm install`.
8. The Appointment API starts with `npm run start:dev`
9. Swagger opens at [Swagger UI](http://localhost:3000/api).

### Will be completed during the session

10. You receive the Privatemode API key.
11. You start the Privatemode proxy with the provided API key.
12. Claude Code responds inside VS Code.

If the first section works at home, your local development setup is ready. The Privatemode proxy and Claude Code connection cannot be fully tested before you receive the API key.

## 9. Optional Backup: Claude Code CLI

Use this only if the VS Code extension setup does not work or if you explicitly want to run Claude Code from the terminal. For this workshop, the VS Code extension setup is recommended.

Install Claude Code according to the official quickstart guide:

- [Claude Code Quickstart](https://code.claude.com/docs/en/quickstart)

Then configure Claude Code to use Privatemode as described in the official Privatemode guide:

- [Privatemode Claude Code Guide](https://docs.privatemode.ai/guides/coding-assistants-claude-code/)

The required values are the same as in the VS Code configuration:

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

Start Claude Code from the project folder:

```bash
cd appointment-api
claude
```

## 10. References

### Tool Installation Guides

- Anthropic. (n.d.). _Use Claude Code in VS Code_. Retrieved June 26, 2026, from [https://code.claude.com/docs/en/vs-code](https://code.claude.com/docs/en/vs-code)
- Docker. (n.d.). _Docker Desktop_. Retrieved June 26, 2026, from [https://docs.docker.com/desktop/](https://docs.docker.com/desktop/)
- Git. (n.d.). _Installing Git_. Retrieved June 26, 2026, from [https://git-scm.com/book/en/v2/Getting-Started-Installing-Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Microsoft. (2026, June 24). _Get started with Visual Studio Code_. Retrieved June 26, 2026, from [https://code.visualstudio.com/docs/getstarted/overview](https://code.visualstudio.com/docs/getstarted/overview)
- Microsoft. (2025, August 6). _How to install Linux on Windows with WSL_. Retrieved June 26, 2026, from [https://learn.microsoft.com/en-us/windows/wsl/install](https://learn.microsoft.com/en-us/windows/wsl/install)
- Node.js. (n.d.). _Download Node.js_. Retrieved June 26, 2026, from [https://nodejs.org/en/download](https://nodejs.org/en/download)
- SUSE. (n.d.). _Installation - Rancher Desktop Docs_. Retrieved June 26, 2026, from [https://docs.rancherdesktop.io/getting-started/installation/](https://docs.rancherdesktop.io/getting-started/installation/)

### Claude Code and Privatemode Configuration References

- Anthropic. (n.d.). _Claude Code Quickstart_. Retrieved June 26, 2026, from [https://code.claude.com/docs/en/quickstart](https://code.claude.com/docs/en/quickstart)
- Anthropic. (n.d.). _Environment variables_. Retrieved June 26, 2026, from [https://code.claude.com/docs/en/env-vars](https://code.claude.com/docs/en/env-vars)
- Anthropic. (n.d.). _Claude Code settings_. Retrieved June 26, 2026, from [https://code.claude.com/docs/en/settings](https://code.claude.com/docs/en/settings)
- Edgeless Systems. (2026, June 24). _Claude Code - Privatemode_. Retrieved June 26, 2026, from [https://docs.privatemode.ai/guides/coding-assistants-claude-code/](https://docs.privatemode.ai/guides/coding-assistants-claude-code/)
- Edgeless Systems. (2026, June 24). _API quickstart_. Retrieved June 26, 2026, from [https://docs.privatemode.ai/getting-started/proxy-api/](https://docs.privatemode.ai/getting-started/proxy-api/)
