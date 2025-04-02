import { Stream } from '../dto/stream';
import { Torrent } from '../dto/torrent';

export function prettyBytes(num: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (num >= 1024) {
    num /= 1024;
    i++;
  }
  return `💾 ${' '} ${num.toFixed(2)} ${units[i]}`;
}

export function prettySeeds(seeds: number): string {
  const getEmoji = (seeds: number): string => {
    if (seeds >= 50) return '🥰';
    if (seeds >= 10) return '🙂';
    if (seeds >= 1) return '😒';
    return '🫥';
  };
  return `${getEmoji(seeds)} ${' '} ${seeds >= 100 ? '100+' : seeds} seeds`;
}

export function prettyResolution(title: string): string {
  const resolutions = {
    '144p': 'SD',
    '240p': 'SD',
    '360p': 'SD',
    '480p': 'SD',
    '720p': 'HD',
    '1080p': 'FHD',
    '2160p': '4K',
  };
  const [resolution = '720p'] = title.match(/(144p|240p|360p|480p|720p|1080p|2160p)/i) ?? [];
  return `📺 ${' '} ${resolutions?.[resolution]} ${resolution}`;
}

export function prettyRipType(title: string): string {
  const [ripType] = title.match(/(BluRay|WEBRip|DVDRip|HDRip|BRRip)/i) ?? [];
  return ripType ? `💿 ${' '} ${ripType}` : '';
}

export function parseTorrentToStream(torrent: Torrent): Stream {
  return {
    title: [
      prettyResolution(torrent.title),
      prettyRipType(torrent.title),
      prettySeeds(torrent.seeds),
      prettyBytes(torrent.sizeBytes),
    ]
      .filter((info) => !!info)
      .join('\n'),
    infoHash: torrent.infoHash.toLowerCase(),
  };
}
