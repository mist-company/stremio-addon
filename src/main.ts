import { addonBuilder, Manifest, Args, Stream, serveHTTP } from 'stremio-addon-sdk';
import { Title } from './title';
import { MongoHelper } from './mongo';
import { prettyBytes, prettyResolution, prettySeeds } from './utils';

const manifest: Manifest = {
  id: 'org.zimba.mist-company',
  version: '0.1.0',
  name: 'Zimba',
  description: 'Zimba',
  resources: ['stream'],
  types: ['movie'],
  idPrefixes: ['tt'],
  catalogs: [],
};

const builder = new addonBuilder(manifest);
const db = new MongoHelper();

builder.defineStreamHandler(async (args: Args) => {
  if (args.type === 'movie') {
    console.log('Requesting streams for', args.id);
    const collection = await db.getCollection('catalog', 'titles');
    const title = await collection.findOne<Title>({ imdbId: args.id, torrents: { $exists: true, $ne: null } });
    if (!title) {
      console.log('Title not found', args.id);
      return { streams: [] };
    }
    const streams: Stream[] = title.torrents.map<Stream>((torrent) => ({
      type: 'movie',
      name: `Torrent`,
      title: [
        `📺 ${prettyResolution(torrent.quality)} ${torrent.type.toUpperCase()}`,
        `${prettySeeds(torrent.seeds)} | 💾 ${prettyBytes(torrent.size)}`,
      ].join('\n'),
      infoHash: torrent.hash.toLowerCase(),
    }));
    console.log(`Found ${streams.length} streams for`, args.id);
    return { streams };
  } else {
    return { streams: [] };
  }
});

serveHTTP(builder.getInterface(), { port: +process.env.PORT });
