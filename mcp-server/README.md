# PYVEX — MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that exposes PYVEX's styling intelligence to any MCP-compatible client — Claude Desktop, Claude Code, Continue, Zed, etc. Once installed, the assistant can call AURA's tools directly as if they were native.

## What it exposes

### Tools

| Name | What it does |
|---|---|
| `get_weather` | Current weather + 5-day forecast for any city. |
| `recommend_outfit` | Head-to-toe look (top, bottom, outer, foot, extras) for a given `tempF` + condition. |
| `daily_look` | Weather + outfit in one call. The fastest "what should I wear?" |
| `analyze_skin_tone` | Eight flattering clothing colors for a described complexion. |
| `get_aesthetic` | Palette + signature pieces + recommended brands for a named aesthetic. |
| `list_aesthetics` | All 10 AURA aesthetic worlds with one-line summaries. |

### Resources

Read-only design-system data:

- `aura://design-system/colors` — raw + semantic color tokens
- `aura://design-system/typography` — families, scale, rules
- `aura://design-system/voice` — brand voice, tone, copy rules
- `aura://design-system/motion` — easing, durations, hover/press states

## Install

```bash
cd mcp-server
npm install
cp .env.example .env
# open .env, paste your RapidAPI key
```

You need a RapidAPI key for the [open-weather13](https://rapidapi.com/worldapi/api/open-weather13) endpoint. Free tier is plenty.

## Test it locally

```bash
npm run inspect
```

This boots the MCP Inspector — a browser UI where you can list tools, call them, and read resources. Pick `get_weather`, pass `{"city": "Milan"}`, and you should see a JSON forecast back.

Or run it directly:

```bash
npm start
```

The server speaks MCP over stdio, so it'll wait silently for a client. Use the inspector or wire it into a client (below).

## Wire into Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "pyvex": {
      "command": "node",
      "args": ["/absolute/path/to/PYVEX/mcp-server/src/index.js"],
      "env": {
        "RAPIDAPI_KEY": "your_rapidapi_key_here"
      }
    }
  }
}
```

Restart Claude Desktop. You should see "pyvex" listed in the MCP tools menu (hammer icon). Try: _"What should I wear in Milan today?"_

## Wire into Claude Code

```bash
claude mcp add pyvex -- node /absolute/path/to/PYVEX/mcp-server/src/index.js
```

Then set `RAPIDAPI_KEY` in your shell:

```bash
export RAPIDAPI_KEY=your_rapidapi_key_here
```

## Example calls

**Daily look for a city:**
```json
{ "name": "daily_look", "arguments": { "city": "Milan" } }
```
→ Returns weather + outfit in one response.

**Outfit for a specific climate:**
```json
{ "name": "recommend_outfit", "arguments": { "tempF": 42, "condition": "Rain" } }
```
→ Camel trench, merino turtleneck, wide-leg wool, Chelsea boot, silk scarf + umbrella + waterproof boot.

**Skin tone palette:**
```json
{ "name": "analyze_skin_tone", "arguments": { "description": "Warm olive, sun-kissed, dark brown hair" } }
```
→ 8 colors with hex + editorial note each.

**Look up an aesthetic:**
```json
{ "name": "get_aesthetic", "arguments": { "aesthetic": "quiet luxury" } }
```
→ Palette, signature pieces, brand list.

## File layout

```
mcp-server/
├── package.json
├── .env.example          ← copy to .env, fill in RAPIDAPI_KEY
├── README.md
└── src/
    ├── index.js          ← MCP server entry
    ├── tools/
    │   ├── weather.js
    │   ├── outfit.js
    │   ├── tone.js
    │   └── aesthetics.js
    └── resources/
        └── design-system.js
```

## Security

- The RapidAPI key is read from `.env` or the parent process's environment. **Never commit `.env`.**
- This server runs locally over stdio — it has no network listener of its own. Only the MCP client (and your local Node process) can talk to it.

## License

MIT
