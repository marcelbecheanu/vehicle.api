import { Pool } from 'pg';
import { database, server } from './../configs/settings.json';

const pool = new Pool(server.production ? database.production : database.development);

export default pool;