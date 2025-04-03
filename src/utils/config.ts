export const IS_PRODUCTION_ENV = process.env.NODE_ENV === 'production';
export const PORT = process.env.PORT ?? 7000;
export const DB_URL = process.env.DB_URL;
export const DB_NAME = process.env.DB_NAME ?? 'catalog-local';
export const ADDON_ID = 'org.zmb.mist-company';
export const ADDON_NAME = 'ZMBaddon';
export const REDIS_URL = process.env.REDIS_URL;
export const CATALOG_ENRICHMENT_API_URL = process.env.CATALOG_ENRICHMENT_API_URL;
export const FIND_TORRENT_JOB_NAME = process.env.FIND_TORRENT_JOB_NAME ?? 'find-torrent-job-local';
export const CATALOG_ENRICHMENT_QUEUE_NAME =
  process.env.CATALOG_ENRICHMENT_QUEUE_NAME ?? 'catalog-enrichment-queue-local';

export const MANIFEST = {
  id: IS_PRODUCTION_ENV ? ADDON_ID : `${ADDON_ID}.dev`,
  name: IS_PRODUCTION_ENV ? ADDON_NAME : `${ADDON_NAME} (dev)`,
  description: 'ZMB - Stremio addon for torrent streaming',
  version: process.env.npm_package_version,
  resources: ['stream'],
  types: ['movie', 'series'],
  idPrefixes: ['tt'],
  catalogs: [],
  logo: 'https://www.stremio.com/website/stremio-logo-small.png',
};
