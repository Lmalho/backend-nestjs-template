import { registerAs } from '@nestjs/config';
import { QueueOptions } from 'bull';

export default registerAs<QueueOptions>('bull', (): QueueOptions => {
  const { REDIS_URL, REDIS_PORT } = process.env;

  const options: QueueOptions = {
    redis: {
      host: REDIS_URL,
      port: +REDIS_PORT,
    },
  };
  return options;
});
