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
    jwt: {
      secret: process.env.SECRET || 'secret',
    }
};