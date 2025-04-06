import { Stream } from '../dto/stream';
import { Torrent } from '../dto/torrent';
import { ADDON_NAME } from './config';

export function prettyBytes(num: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (num >= 1024) {
    num /= 1024;
    i++;
  }
  return `${num.toFixed(2)} ${units[i]}`;
}

export function prettySeeds(seeds: number): { emoji: string; quantity: string } {
  const getEmoji = (seeds: number): string => {
    if (seeds >= 50) return '🥰';
    if (seeds >= 10) return '🙂';
    if (seeds >= 1) return '😒';
    return '🫥';
  };
  const getQuantity = (seeds: number): string => {
    if (seeds >= 999) return '999+';
    return seeds.toString();
  };
  return {
    emoji: getEmoji(seeds),
    quantity: getQuantity(seeds),
  };
}

export function prettyResolution(title: string): string {
  const resolutions = {
    '144p': '144p',
    '240p': '240p',
    '360p': '360p',
    '480p': '480p',
    '720p': '720p',
    '1080p': '1080p',
    '2160p': '2160p',
    '4K': '2160p',
    '8K': '4320p',
  };
  const [resolution = '480p'] = title.match(/(144p|240p|360p|480p|720p|1080p|2160p|4K|8K)/i) ?? [];
  return `${resolutions?.[resolution]}`;
}

export function parseTorrentToStream(torrent: Torrent): Stream {
  const resolution = prettyResolution(torrent.title);
  const seeds = prettySeeds(torrent.seeds);
  const size = prettyBytes(torrent.sizeBytes);
  return {
    title: `${torrent.title}\n${seeds.emoji} ${seeds.quantity} seeds 💾 ${size} ⚙️ ${torrent.tracker}`,
    name: `${ADDON_NAME} ${resolution}`,
    infoHash: torrent.infoHash.toLowerCase(),
  };
}
