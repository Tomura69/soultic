import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import * as typeorm from 'typeorm';
import * as classValidator from 'class-validator';
import i18n from 'i18n';
import { createConnection } from 'typeorm';
import { Container } from 'typedi';
import { SessionRepo } from './repositories/SessionRepo';
import { TypeormStore } from './lib/session/TypeormStore';
import { createApiEndPoint } from './utils/createApiEndPoint';
import { confirmEmail } from './lib/email/confirmEmail';
import { __prod__ } from './constants/prod';
import { shopSchema } from './api/shop-api/schema';
import { adminSchema } from './api/admin-api/schema';

// Enviroment
dotenv.config();

// Dependecy injection
typeorm.useContainer(Container);
classValidator.useContainer(Container);

// API
const port = process.env.PORT || 4000;

const main = async () => {
  await createConnection();

  /**
   * Api configuration
   */

  const app = express();

  const corsOptions: CorsOptions = {
    credentials: true,
    origin: process.env.ADMIN_UI_URL,
  };

  app.set('trust proxy', '127.0.0.1');
  app.use(cors(corsOptions));

  /**
   * Locales
   */

  i18n.configure({
    locales: ['en', 'lt'],
    defaultLocale: 'lt',
    cookie: 'locale',
    directory: __dirname + './../locales',
  });

  app.use(i18n.init);

  /**
   * Session
   */
  const SESSION_SECRET = process.env.SESSION_SECRET!;
  const SESSION_TTL = 1000 * 60 * 60 * 24 * +process.env.SESSION_TTL!;
  const repository = typeorm.getCustomRepository(SessionRepo);

  app.get(`${process.env.REGISTER_CONFIRM_URL!}/:id`, confirmEmail);

  await createApiEndPoint('/shop-api', app, corsOptions, shopSchema, {
    resave: false,
    saveUninitialized: true,
    name: 'sid',
    store: new TypeormStore({ repository, ttl: SESSION_TTL }),
    secret: SESSION_SECRET,
    cookie: {
      httpOnly: true,
      secure: __prod__,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
  });

  await createApiEndPoint('/admin-api', app, corsOptions, adminSchema, {
    resave: false,
    saveUninitialized: false,
    name: 'admin.sid',
    store: new TypeormStore({ repository, ttl: SESSION_TTL }),
    secret: SESSION_SECRET,
    cookie: {
      httpOnly: true,
      secure: __prod__,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
  });

  app.listen(port, () => console.log(`Server started on port ${port}`));
};

main();
