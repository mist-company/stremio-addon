import { DatabaseTorrentGateway } from '../gateway/database-torrent.gateway';
import { HttpTorrentGateway } from '../gateway/http-torrent.gateway';
import { Torrent } from '../dto/torrent';
import { inject, injectable } from 'tsyringe';
import { QueueHelper } from '../helper/queue.helper';
import { FIND_TORRENT_JOB_NAME } from '../utils/config';

export type SearchTorrentsInput = {
  imdbId: string;
};

@injectable()
export class SearchTorrentsUseCase {
  constructor(
    @inject(DatabaseTorrentGateway) private readonly databaseTorrentGateway: DatabaseTorrentGateway,
    @inject(HttpTorrentGateway) private readonly httpTorrentGatway: HttpTorrentGateway,
    @inject(QueueHelper) private readonly queue: QueueHelper,
  ) {}

  async execute(input: SearchTorrentsInput): Promise<Torrent[]> {
    let torrents: Torrent[] = [];
    console.log(`Searching torrents for ${input.imdbId} in database`);
    torrents = await this.databaseTorrentGateway.search(input);
    if (torrents.length) {
      console.log(`Found ${torrents.length} torrents for ${input.imdbId} in database`);
      this.queue.add(FIND_TORRENT_JOB_NAME, { imdbId: input.imdbId }, { enableDeduplication: true });
      console.log(`Added ${input.imdbId} to queue for more torrent search`);
      return torrents;
    }
    console.log(`Searching torrents for ${input.imdbId} in web`);
    torrents = await this.httpTorrentGatway.search(input);
    if (torrents.length) {
      console.log(`Found ${torrents.length} torrents for ${input.imdbId} in web`);
      return torrents;
    }
    console.log(`No torrents found for ${input.imdbId}`);
    return torrents;
  }
}
