import { Torrent } from '../dto/torrent';
import { BaseTorrentGateway, BaseTorrentSearchInput } from './base-torrent.gateway';
import { injectable } from 'tsyringe';
import { CATALOG_ENRICHMENT_API_URL } from '../utils/config';

@injectable()
export class HttpTorrentGateway implements BaseTorrentGateway {
  async search(input: BaseTorrentSearchInput): Promise<Torrent[]> {
    const url = new URL(`api/torrents/${input.imdbId}`, CATALOG_ENRICHMENT_API_URL);
    const request = await fetch(url.toString());
    if (!request.ok) {
      throw new Error(`Failed to fetch torrents: ${request.statusText}`);
    }
    const torrents = (await request.json()) as Torrent[];
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
