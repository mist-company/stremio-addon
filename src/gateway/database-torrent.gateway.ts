import { Torrent } from '../dto/torrent';
import { BaseTorrentGateway, BaseTorrentSearchInput } from './base-torrent.gateway';
import { injectable, inject } from 'tsyringe';
import { DBHelper } from '../helper/db.helper';

@injectable()
export class DatabaseTorrentGateway implements BaseTorrentGateway {
  private readonly collectionName = 'torrents';

  constructor(@inject(DBHelper) private readonly database: DBHelper) {}

  async search(input: BaseTorrentSearchInput): Promise<Torrent[]> {
    const collection = await this.database.getCollection(this.collectionName);
    const torrents = await collection.find({ imdbId: input.imdbId }).toArray();
    return torrents.map(
      (torrent): Torrent => ({
        imdbId: torrent.imdbId,
        title: torrent.title,
        tracker: torrent.tracker,
        infoHash: torrent.infoHash,
        magnetUri: torrent.magnetUri,
        sizeBytes: torrent.sizeBytes,
        seeds: torrent.seeds,
        peers: torrent.peers,
      }),
    );
  }
}
