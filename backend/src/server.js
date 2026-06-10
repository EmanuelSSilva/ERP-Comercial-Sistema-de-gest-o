import { app } from './app.js';
import { env } from './shared/config/env.js';
import { logger } from './shared/logger/logger.js';

app.listen(env.port, () => {
  logger.info(`API ERP Comercial executando na porta ${env.port}`);
});
