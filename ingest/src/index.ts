import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, type Request, type Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import pg from 'pg';
import { v4 } from 'uuid';

const tryParseInt = (value?: string) => {
  if (!value) return null;
  const v = parseInt(value);
  if (Number.isNaN(v)) return null;
  return v;
};

const validateAccessMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.params.token;
    const { payload } = verify(token, process.env.JWT_SECRET ?? '', {
      algorithms: ['HS256'],
      complete: true,
    });
    if (!(typeof payload === 'object' && payload !== null && 'projectId' in payload)) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.context = { ...(req.context ? req.context : {}), projectId: payload.projectId };
    next();
  } catch (e) {
    console.error(e);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

const sessionIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.cookies['ingest-session-id'];
  if (typeof sessionId !== 'string') {
    return res.status(403).json({ message: 'Invalid session' });
  }
  req.context = { ...(req.context ? req.context : {}), sessionId };
  next();
};

(async () => {
  const app = express();

  const { Client } = pg;

  const client = new Client({
    port: tryParseInt(process.env['DB_PORT']) ?? 4677,
    host: process.env['DB_HOST'] ?? 'localhost',
    user: process.env['DB_USER'] ?? 'username',
    password: process.env['DB_PASSWORD'] ?? 'password',
    database: process.env['DB_DATABASE'] ?? 'default_database',
  });

  await client.connect();

  const updateOrigins = () =>
    client
      .query('select "projectId", "origin" from projects where "origin" is not null')
      .then((res) => res.rows.reduce((a, v) => ({ ...a, [v.projectId]: v.origin }), {}));
  const origins = await updateOrigins();

  app.use(express.json({ limit: '1gb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Admin stuff

  // todo: validate login here!
  app.get('/:projectId/token', async (req, res) => {
    const token = sign(
      JSON.stringify({ projectId: req.params.projectId }),
      process.env.JWT_SECRET ?? '',
      { algorithm: 'HS256' },
    );
    return res.json({ token }).status(200).send();
  });

  // Ingest stuff

  app.use(
    '/:token',
    validateAccessMiddleware,
    cors((req: Request, cb) => {
      const projectId = req.context!.projectId;
      if (!(projectId in origins)) {
        return cb(new Error('Not found'));
      }
      cb(null, {
        origin: origins[projectId], //'http://localhost:5173',
        credentials: true,
      });
    }),
  );

  app.post('/:token/load', validateAccessMiddleware, async (req, res) => {
    const data = req.body;
    const sessionId = v4();
    const text =
      'insert into entries("projectId", "entryType", "sessionId", "data") VALUES($1, $2, $3, $4) RETURNING *';
    const values = [req.context!.projectId, 'load', sessionId, data];
    await client.query(text, values);
    res.cookie('ingest-session-id', sessionId, {
      secure: false,
      sameSite: 'lax',
    });
    res.sendStatus(201);
  });

  app.post(
    '/:token/:eventType',
    validateAccessMiddleware,
    sessionIdMiddleware,
    async (req, res) => {
      const type = req.params.eventType;
      const data = req.body;
      const sessionId = req.context!.sessionId ?? null;
      const text =
        'insert into entries("projectId", "entryType", "sessionId", "data") VALUES($1, $2, $3, $4) RETURNING *';
      const values = [req.context!.projectId, type, sessionId, data];
      await client.query(text, values);
      res.sendStatus(201);
    },
  );

  const port = process.env.PORT ?? 4500;
  app.listen(port, () => console.log(`Listening on port ${port}`));
})().catch(console.error);
