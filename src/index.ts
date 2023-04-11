console.clear();

import express from 'express';
import compression from 'compression';

import { server } from './configs/settings.json';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Routes
app.listen(server.port || 9000, () => console.log(`Server has started on ${server.port || 9000}.`));