export interface Torrent {
  imdbId: string;
  title: string;
  tracker: string;
  infoHash: string;
  magnetUri: string;
  sizeBytes: number;
  seeds: number;
  peers: number;
}
