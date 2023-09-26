import { registerAs } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Params } from 'nestjs-pino';

export const LoggerConfigKey = 'logger';

export const LoggerConfig = registerAs<Params>(LoggerConfigKey, (): Params => {
  const { LOG_LEVEL, LOGGER_ENABLED, LOGGER_PRETTY_PRINT, NODE_ENV } =
    process.env;

  // standard logger params
  // later should delete headers and other important info from Logs in production with a serializer
  const loggerParams: Params = {
    pinoHttp: {
      level: LOG_LEVEL || 'info',
      enabled: LOGGER_ENABLED === 'true' ? true : NODE_ENV !== 'test',
      transport:
        LOGGER_PRETTY_PRINT === 'true' ? { target: 'pino-pretty' } : undefined,
      genReqId: () => {
        return randomUUID();
      },
    },
  };

  return loggerParams;
});
