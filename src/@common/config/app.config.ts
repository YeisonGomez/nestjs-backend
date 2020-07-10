import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
  appPort: +process.env.PORT,
  appPrefix: process.env.APP_URL_PREFIX,
  appHostServer: process.env.NODE_ENV === 'local' ?
    `${process.env.APP_HOST_SERVER}:${+process.env.PORT}` : process.env.APP_HOST_SERVER,
  appHostClient: process.env.APP_HOST_CLIENT
}))