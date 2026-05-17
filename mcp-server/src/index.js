#!/usr/bin/env node
/* PYVEX — MCP server entry point.
 *
 * Exposes fashion-intelligence tools over the Model Context Protocol so any
 * MCP-compatible client (Claude Desktop, Claude Code, Continue, etc.) can call
 * PYVEX's brains as if they were native tools.
 *
 * Tools:
 *   - get_weather              City -> current weather + 5-day forecast
 *   - recommend_outfit         tempF + condition -> head-to-toe look
 *   - daily_look               City -> weather + recommended outfit in one call
 *   - analyze_skin_tone        Complexion description -> 8 flattering colors
 *   - get_aesthetic            Style name -> palette + signatures + brands
 *   - list_aesthetics          -> all 10 aesthetic worlds
 *
 * Resources (read-only):
 *   - aura://design-system/colors
 *   - aura://design-system/typography
 *   - aura://design-system/voice
 *   - aura://design-system/motion
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { getWeather } from './tools/weather.js';
import { recommendOutfit } from './tools/outfit.js';
import { analyzeSkinTone } from './tools/tone.js';
import { getAesthetic, listAesthetics } from './tools/aesthetics.js';
import { COLORS, TYPOGRAPHY, VOICE, MOTION } from './resources/design-system.js';

// ─── Load .env (no external dependency) ──────────────────────────────
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envText = await readFile(join(__dirname, '..', '.env'), 'utf8');
  for (const line of envText.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
} catch {
  // .env is optional — RAPIDAPI_KEY may come from the shell environment
}

// ─── Server setup ────────────────────────────────────────────────────
const server = new Server(
  { name: 'pyvex', version: '0.1.0' },
  { capabilities: { tools: {}, resources: {} } },
);

// ─── Tool definitions ────────────────────────────────────────────────
const TOOLS = [
  {
    name: 'get_weather',
    description: 'Fetch current weather and a 5-day forecast for a city. Used by PYVEX to dress users for the actual sky.',
    inputSchema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name, optionally with region or country, e.g. "Milan" or "Paris, France".' },
      },
      required: ['city'],
    },
  },
  {
    name: 'recommend_outfit',
    description: 'Return a head-to-toe outfit (top, bottom, outer, foot, extras) for a given temperature and condition. Editorial palette + headline included.',
    inputSchema: {
      type: 'object',
      properties: {
        tempF:     { type: 'number', description: 'Temperature in Fahrenheit.' },
        condition: { type: 'string', description: 'Weather condition: Clear, Clouds, Rain, Drizzle, Thunderstorm, Snow, Mist, Fog, Haze, Smoke, Dust. Defaults to Clear.' },
      },
      required: ['tempF'],
    },
  },
  {
    name: 'daily_look',
    description: 'Get today\'s full styling brief for a city in one call: weather report + recommended outfit. The fastest path to "what should I wear?"',
    inputSchema: {
      type: 'object',
      properties: { city: { type: 'string', description: 'City name.' } },
      required: ['city'],
    },
  },
  {
    name: 'analyze_skin_tone',
    description: 'Generate eight clothing colors flattering for a complexion. Pass a free-text description, or specify undertone + depth directly.',
    inputSchema: {
      type: 'object',
      properties: {
        description: { type: 'string', description: 'Free-text description, e.g. "Warm olive, sun-kissed, dark hair".' },
        undertone:   { type: 'string', enum: ['warm', 'cool', 'neutral', 'olive'], description: 'Override detected undertone.' },
        depth:       { type: 'string', enum: ['fair', 'medium', 'deep'], description: 'Override detected depth.' },
      },
    },
  },
  {
    name: 'get_aesthetic',
    description: 'Look up an aesthetic style: get its palette, signature pieces, and recommended brands.',
    inputSchema: {
      type: 'object',
      properties: {
        aesthetic: { type: 'string', description: 'Aesthetic name or alias, e.g. "quiet luxury", "techwear", "old money".' },
      },
      required: ['aesthetic'],
    },
  },
  {
    name: 'list_aesthetics',
    description: 'List all 10 PYVEX aesthetic worlds with a one-line summary of each.',
    inputSchema: { type: 'object', properties: {} },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  const wrap = async (fn) => {
    try {
      const data = await fn();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Error: ${err.message}` }],
      };
    }
  };

  switch (name) {
    case 'get_weather':
      return wrap(() => getWeather(args));

    case 'recommend_outfit':
      return wrap(() => recommendOutfit(args));

    case 'daily_look':
      return wrap(async () => {
        const weather = await getWeather(args);
        const outfit = recommendOutfit({
          tempF: weather.current.tempF,
          condition: weather.current.condition,
        });
        return { location: weather.location, weather: weather.current, outfit };
      });

    case 'analyze_skin_tone':
      return wrap(() => analyzeSkinTone(args));

    case 'get_aesthetic':
      return wrap(() => getAesthetic(args));

    case 'list_aesthetics':
      return wrap(() => listAesthetics());

    default:
      return {
        isError: true,
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      };
  }
});

// ─── Resources ───────────────────────────────────────────────────────
const RESOURCES = [
  { uri: 'aura://design-system/colors',     name: 'Colors',     description: 'Raw and semantic color tokens.',     mimeType: 'application/json' },
  { uri: 'aura://design-system/typography', name: 'Typography', description: 'Type families, scale, and rules.',   mimeType: 'application/json' },
  { uri: 'aura://design-system/voice',      name: 'Voice',      description: 'Brand voice, tone, and copy rules.', mimeType: 'application/json' },
  { uri: 'aura://design-system/motion',     name: 'Motion',     description: 'Easing, durations, hover/press states.', mimeType: 'application/json' },
];

const RESOURCE_DATA = {
  'aura://design-system/colors':     COLORS,
  'aura://design-system/typography': TYPOGRAPHY,
  'aura://design-system/voice':      VOICE,
  'aura://design-system/motion':     MOTION,
};

server.setRequestHandler(ListResourcesRequestSchema, async () => ({ resources: RESOURCES }));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const data = RESOURCE_DATA[uri];
  if (!data) throw new Error(`Unknown resource: ${uri}`);
  return {
    contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(data, null, 2) }],
  };
});

// ─── Boot ─────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
// MCP servers are silent on stdout (it's the protocol channel). Log to stderr.
console.error('[pyvex-mcp] ready · 6 tools, 4 resources');
