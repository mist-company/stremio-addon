import { Torrent } from '../dto/torrent';

export type BaseTorrentSearchInput = {
  imdbId: string;
};

export interface BaseTorrentGateway {
  search(input: BaseTorrentSearchInput): Promise<Torrent[]>;
}
