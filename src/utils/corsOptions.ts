import { CorsOptions } from 'cors';

const allowedOrigins = [
  'https://www.acmeerp.com.ng',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (origin && allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed'), false);
    }
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
