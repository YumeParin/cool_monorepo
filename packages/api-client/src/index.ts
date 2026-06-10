import { serverApi } from './services/servers';
import { serverUtils } from './utils/server';
export { setBaseUrl } from './client';

export const api = {
  servers: serverApi,
};
export const utils = {
  server: serverUtils,
};
