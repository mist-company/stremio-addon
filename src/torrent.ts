export interface Torrent {
  _id: string;
  titleId: string;
  infoHash: string;
  quality: string;
  ripType: string;
  url: string;
  sizeBytes: number;
  seeds: number;
  peers: number;
  videoCodec: string;
  audioChannels: string;
}
