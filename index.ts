import * as express from 'express';
import { initAPI } from './initialize';

const app = express();
initAPI(app);

const port = 3002;
const server = app.listen(port, () => console.log('Escuchando en el puerto %s ', port));


