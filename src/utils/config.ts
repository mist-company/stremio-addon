export const IS_PRODUCTION_ENV = process.env.NODE_ENV === 'production';
export const PORT = process.env.PORT ?? 7000;
export const DB_URL = process.env.DB_URL;
export const DB_NAME = process.env.DB_NAME ?? 'catalog-local';
export const ADDON_ID = 'org.zimba.mist-company';
export const ADDON_NAME = 'Zimba';
export const REDIS_URL = process.env.REDIS_URL;
export const FIND_TORRENT_JOB_NAME = process.env.FIND_TORRENT_JOB_NAME ?? 'find-torrent-job-local';
export const CATALOG_ENRICHMENT_QUEUE_NAME =
  process.env.CATALOG_ENRICHMENT_QUEUE_NAME ?? 'catalog-enrichment-queue-local';
