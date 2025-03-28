export interface Title {
  _id: string;
  imdbId: string;
  endYear: number | null;
  genres: string[];
  isAdult: boolean;
  originalTitle: string;
  primaryTitle: string;
  ratings: Rating[];
  runtimeMinutes: number;
  startYear: number;
  titleType: string;
  covers: Cover[];
  descriptionFull: string;
  descriptionIntro: string;
  torrents: Torrent[];
  trailers: Trailer[];
}

export interface Rating {
  source: string;
  value: number;
  votes: number;
}

export interface Cover {
  url: string;
  size: string;
}

export interface Torrent {
  hash: string;
  quality: string;
  type: string;
  url: string;
  size: number;
  seeds: number;
  peers: number;
  videoCodec: string;
  audioChannels: string;
}

export interface Trailer {
  code: string;
  type: string;
}
