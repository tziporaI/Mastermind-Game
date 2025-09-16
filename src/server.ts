import app from './app';
import http from 'http';

const port = 3001;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`we up in port ${port}`);
});