import { Queue } from 'bullmq';
import { CATALOG_ENRICHMENT_QUEUE_NAME } from '../utils/config';
const crypto = require('crypto');

export type QueueHelperOptions = {
  enableDeduplication?: boolean;
};

export class QueueHelper {
  private queue: Queue;

  constructor() {
    this.queue = new Queue(CATALOG_ENRICHMENT_QUEUE_NAME, { connection: { url: process.env.REDIS_URL } });
  }

  async add<T>(name: string, data: T, options?: QueueHelperOptions) {
    const queueOptions = {};
    if (options?.enableDeduplication) {
      const deduplicationId = crypto
        .createHash('sha256')
        .update(name + JSON.stringify(data))
        .digest('hex');
      Object.assign(queueOptions, { deduplication: { id: deduplicationId } });
    }
    await this.queue.add(name, data, queueOptions);
  }
}
