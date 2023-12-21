import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import httpProxy from 'express-http-proxy';

import { serverConfig } from './config/server.config';

(async () => {
  try {
    const {
      name,
      host,
      config,
      security,
      services,
    } = await serverConfig();

    const app = express();

    if (config.morgan) {
      app.use(logger('dev'));
    }

    if (security.helmet) {
      app.use(helmet());
    }

    if (security.json) {
      app.use(express.json());
    }

    app.use(express.urlencoded({ extended: true }));

    app.get('/', (_, res) => {
      return res.json({ message: 'API Gateway running' });
    });

    services.forEach(({ service, url }) => {
      app.use(`/${service}`, httpProxy(url, { timeout: 3000 }));
    });

    app.listen(process.env.PORT || config.port, () => {
      console.log(
        `✅ - ${name} is running on host ${host} on port ${config.port}`,
      );
    });
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
})();
