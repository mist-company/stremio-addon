import { addonBuilder, Manifest, Args, Stream, serveHTTP } from 'stremio-addon-sdk';
import { Torrent } from './torrent';
import { DBHelper } from './db';
import { prettyBytes, prettyResolution, prettySeeds } from './utils';
import { ADDON_ID, ADDON_NAME, IS_PRODUCTION_ENV } from './config';

const id = IS_PRODUCTION_ENV ? ADDON_ID : `${ADDON_ID}.dev`;
const name = IS_PRODUCTION_ENV ? ADDON_NAME : `${ADDON_NAME} (dev)`;
const manifest: Manifest = {
  id,
  name,
  description: 'Zimba is a torrent streaming service',
  version: '0.1.0',
  resources: ['stream'],
  types: ['movie'],
  idPrefixes: ['tt'],
  catalogs: [],
};

const builder = new addonBuilder(manifest);
const db = new DBHelper();

builder.defineStreamHandler(async (args: Args) => {
  if (args.type === 'movie') {
    console.log('Requesting streams for', args.id);
    const collection = await db.getCollection('torrents');
    const torrents = await collection.find<Torrent>({ titleId: args.id }).toArray();
    const streams: Stream[] = torrents.map<Stream>((torrent) => ({
      type: 'movie',
      name: `Torrent`,
      title: [
        `📺 ${prettyResolution(torrent.quality)} ${torrent.ripType.toUpperCase()}`,
        `${prettySeeds(torrent.seeds)} | 💾 ${prettyBytes(torrent.sizeBytes)}`,
      ].join('\n'),
      infoHash: torrent.infoHash.toLowerCase(),
    }));
    console.log(`Found ${streams.length} streams for`, args.id);
    return { streams };
  } else {
    return { streams: [] };
  }
});

serveHTTP(builder.getInterface(), { port: +process.env.PORT });
