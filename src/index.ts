import { connectToDatabase } from './db';
import express from 'express';
import http from 'http';
import cors from 'cors';
import ShortenUrlRoutes from './shortenurl/ShortenurlRoutes';

connectToDatabase()
 .then(() => {
  const app = express();
  const server = http.createServer(app);

  app.use(cors());
  app.use(express.json());
  const routes = new ShortenUrlRoutes();
  app.use('/', routes.router);
  const port = 8090;

  server.listen(port, () => {
   console.log(`Server is running on port ${port}`);
  });
 })
 .catch();
