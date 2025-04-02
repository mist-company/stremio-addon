import express from 'express';
import { Torrent } from './dto/torrent';
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
import { Stream } from './dto/stream';

const id = IS_PRODUCTION_ENV ? ADDON_ID : `${ADDON_ID}.dev`;
const name = IS_PRODUCTION_ENV ? ADDON_NAME : `${ADDON_NAME} (dev)`;
const manifest = {
  id,
  name,
  description: 'ZMB - Stremio addon for torrent streaming',
  version: '0.2.0',
  resources: ['stream'],
  types: ['movie', 'series'],
  idPrefixes: ['tt'],
  catalogs: [],
  logo: 'https://www.stremio.com/website/stremio-logo-small.png',
};

const db = new DBHelper();
const app = express();

app
  .set('views', 'view')
  .set('view engine', 'ejs')
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.get('/', (req, res) => {
  res.render('index.ejs', { manifest, installUrl: `stremio://${req.host}/manifest.json` });
});

app.get('/manifest.json', (_, res) => void res.json(manifest));

app.get('/stream/:type/:id.json', async (req, res) => {
  const args = req.params;
  console.log(`requesting streams for ${args.type} ${args.id}`);
  const torrentCollection = await db.getCollection('torrents');
  const torrents = await torrentCollection.find<Torrent>({ imdbId: args.id }).toArray();
  if (torrents.length) {
    const streams: Stream[] = torrents.map(parseTorrentToStream);
    await queue.add(FIND_TORRENT_JOB_NAME, { imdbId: args.id }, { deduplication: { id: args.id } });
    console.log(`found ${streams.length} streams for`, args.id);
    res.json({ streams });
    return;
  }
  console.log(`no torrents found in database for ${args.id}`);
  const request = await fetch(new URL(`api/torrents/${args.id}`, CATALOG_ENRICHMENT_API_URL).toString());
  if (!request.ok) {
    console.log(`failed to fetch torrents for ${args.id}`, request.statusText);
    res.json({ streams: [] });
    return;
  }
  const data = (await request.json()) as Torrent[];
  console.log(`found ${data.length} torrents on jackett for ${args.id}`);
  res.json({ streams: data.map(parseTorrentToStream) });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
