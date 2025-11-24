# Claude Desktop MCP Setup for Windgap Academy

## 🎯 Quick Setup Instructions

### Step 1: Download the Config File

The config file has been created: **`claude_desktop_config.json`**

1. **Download it** from VS Code:
   - Right-click `claude_desktop_config.json` in the Explorer
   - Select "Download..."
   - Save it to your computer

### Step 2: Copy to Claude Desktop Config Location

**macOS:**

```bash
# Open Terminal and run:
mkdir -p ~/Library/Application\ Support/Claude
cp ~/Downloads/claude_desktop_config.json ~/Library/Application\ Support/Claude/
```

**Windows:**

```powershell
# Open PowerShell and run:
Copy-Item "$env:USERPROFILE\Downloads\claude_desktop_config.json" "$env:APPDATA\Claude\"
```

**Linux:**

```bash
# Open Terminal and run:
mkdir -p ~/.config/Claude
cp ~/Downloads/claude_desktop_config.json ~/.config/Claude/
```

### Step 3: Update the Workspace Path

⚠️ **IMPORTANT**: You need to change the workspace path to your **local** path.

Edit the downloaded file and replace `/workspaces/windgapacademy` with your local path:

**If you cloned the repo locally:**

- macOS: `/Users/yourname/windgapacademy`
- Windows: `C:\\Users\\yourname\\windgapacademy`
- Linux: `/home/yourname/windgapacademy`

**If you haven't cloned it yet:**

```bash
# Clone to your local machine first
git clone https://github.com/nerdedi/windgapacademy.git
cd windgapacademy
npm install
```

### Step 4: (Optional) Add GitHub Token

If you want GitHub integration, add your Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `read:org`
4. Copy the token
5. In `claude_desktop_config.json`, replace the empty `GITHUB_PERSONAL_ACCESS_TOKEN` value

### Step 5: Restart Claude Desktop

1. **Quit Claude Desktop** completely (not just close the window)
2. **Reopen Claude Desktop**
3. Look for the 🔌 MCP connection indicator

### Step 6: Test It

In Claude Desktop, ask:

> "Can you list the main directories in my windgap academy workspace?"

If Claude can see your files, it worked! ✅

## 🔧 Troubleshooting

**Claude doesn't see the workspace:**

- Verify the path in the config is correct and uses forward slashes
- Make sure you restarted Claude Desktop completely
- Check that the folder exists on your local machine

**MCP servers not loading:**

- Open Claude Desktop logs (Help → View Logs)
- Look for MCP initialization errors
- Ensure Node.js and npm are installed

**Permission errors:**

- Make sure the workspace path is readable
- On macOS, you may need to grant Terminal/Claude access in System Preferences

## ✨ What You'll Get

Once configured, Claude Desktop can:

- ✅ Read all files in your Windgap Academy project
- ✅ Help you write and edit code
- ✅ Run Playwright tests via MCP
- ✅ Access GitHub repository info (if token provided)
- ✅ Navigate your project structure
- ✅ Analyze your codebase

## 📝 Alternative: Manual Setup

If the above doesn't work, manually create the file:

1. **Find/create the config file:**
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Paste this content** (update the path):

```json
{
  "mcpServers": {
    "windgap-academy": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/YOUR/LOCAL/PATH/TO/windgapacademy"
      ]
    }
  }
}
```

3. Save and restart Claude Desktop

---

**Need help?** The config file is ready in your workspace. Just download it, update the path, and copy it to Claude Desktop's config location! 🚀
