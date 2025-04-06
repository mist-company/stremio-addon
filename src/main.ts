import 'reflect-metadata';
import { MANIFEST } from './utils/config';
import { DBHelper } from './helper/db.helper';
import { parseTorrentToStream } from './utils/utils';
import { Stream } from './dto/stream';
import { container } from 'tsyringe';
import { DatabaseTorrentGateway } from './gateway/database-torrent.gateway';
import { HttpTorrentGateway } from './gateway/http-torrent.gateway';
import { SearchTorrentsUseCase } from './use-case/search-torrents.use-case';
import { app } from './app';
import { QueueHelper } from './helper/queue.helper';

const database = new DBHelper();
const queue = new QueueHelper();

container
  .register(DBHelper, { useValue: database })
  .register(QueueHelper, { useValue: queue })
  .register(DatabaseTorrentGateway, DatabaseTorrentGateway)
  .register(HttpTorrentGateway, HttpTorrentGateway);

const searchTorrentsUseCase = container.resolve(SearchTorrentsUseCase);

app.get('/', (req, res) => {
  const installUrl = `stremio://${req.host}/manifest.json`;
  res.render('index.ejs', { manifest: MANIFEST, installUrl });
});

app.get('/manifest.json', (_, res) => void res.json(MANIFEST));

app.get('/stream/:type/:id.json', async (req, res) => {
  try {
    const args = req.params;
    console.log(`requesting streams for ${args.type} ${args.id}`);
    const torrents = await searchTorrentsUseCase.execute({ imdbId: args.id });
    const streams: Stream[] = torrents.sort((a, b) => b.seeds - a.seeds).map(parseTorrentToStream);
    res.json({ streams });
  } catch (error) {
    console.error(`Error fetching torrents: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

(async () => {
  try {
    await database.connect();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error}`, error);
    await database.disconnect();
    process.exit(1);
  }
})();
