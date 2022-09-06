import dotenv from "dotenv-safe";

dotenv.config();

export default {
    environment: {
      host: process.env.HOST || 'localhost',
      port: Number(String(process.env.PORT)) || 1337,
    },
    dbConfig: {
      url: process.env.DBURL || '',
      saltWorkFactor: Number(String(process.env.SALTWORKFACTOR)) || 10,
    },
    session: {
      secret: process.env.SECRET || 'secret',
    },
    jwt: {
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'J6sqQuxISZfVfS+7/bWTtX',
      refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'J6sqQuxISZfVfS+7/bWTtX'
    }
};