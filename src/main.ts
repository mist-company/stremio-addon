import { Args, Manifest, Stream, addonBuilder, serveHTTP } from 'stremio-addon-sdk';
import { Torrent } from './torrent';
import {
  ADDON_ID,
  ADDON_NAME,
  CATALOG_ENRICHMENT_API_URL,
  FIND_TORRENT_JOB_NAME,
  IS_PRODUCTION_ENV,
} from './utils/config';
import { DBHelper } from './utils/db';
import { queue } from './utils/queue';
import { parseTorrentToStream } from './utils/utils';

const id = IS_PRODUCTION_ENV ? ADDON_ID : `${ADDON_ID}.dev`;
const name = IS_PRODUCTION_ENV ? ADDON_NAME : `${ADDON_NAME} (dev)`;
const manifest: Manifest = {
  id,
  name,
  description: 'ZMB - Stremio addon for torrent streaming',
  version: '0.2.0',
  resources: ['stream'],
  types: ['movie', 'series'],
  idPrefixes: ['tt'],
  catalogs: [],
  logo: 'https://www.stremio.com/website/stremio-logo-small.png',
  background: 'https://www.stremio.com/website/header-mask.png',
};

const builder = new addonBuilder(manifest);
const db = new DBHelper();

builder.defineStreamHandler(async (args: Args) => {
  console.log(`requesting streams for ${args.type} ${args.id}`);
  const torrentCollection = await db.getCollection('torrents');
  const torrents = await torrentCollection.find<Torrent>({ imdbId: args.id }).toArray();
  if (torrents.length) {
    const streams: Stream[] = torrents.map(parseTorrentToStream);
    await queue.add(FIND_TORRENT_JOB_NAME, { imdbId: args.id }, { deduplication: { id: args.id } });
    console.log(`found ${streams.length} streams for`, args.id);
    return { streams };
  }
  console.log(`no torrents found in database for ${args.id}`);
  const request = await fetch(new URL(`api/torrents/${args.id}`, CATALOG_ENRICHMENT_API_URL).toString());
  if (!request.ok) {
    console.log(`failed to fetch torrents for ${args.id}`, request.statusText);
    return { streams: [] };
  }
  const data = (await request.json()) as Torrent[];
  console.log(`found ${data.length} torrents on jackett for ${args.id}`);
  return { streams: data.map(parseTorrentToStream) };
});

serveHTTP(builder.getInterface(), { port: +process.env.PORT });
