export function prettyBytes(num: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (num >= 1024) {
    num /= 1024;
    i++;
  }
  return `${num.toFixed(2)} ${units[i]}`;
}

export function prettySeeds(seeds: number): string {
  const getEmoji = (seeds: number): string => {
    if (seeds >= 50) return '🟢';
    if (seeds >= 10) return '🟡';
    if (seeds >= 1) return '🔴';
    return '⚫';
  };
  return `${getEmoji(seeds)} ${seeds >= 100 ? '100+' : seeds}`;
}

export function prettyResolution(resolution: string): string {
  const resolutions = {
    '144p': 'SD',
    '240p': 'SD',
    '360p': 'SD',
    '480p': 'SD',
    '720p': 'HD',
    '1080p': 'FHD',
    '2160p': '4K',
  };
  return `${resolutions?.[resolution]} ${resolution}`;
}
