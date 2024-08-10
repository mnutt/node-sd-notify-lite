import fs from 'fs';
import unix from 'unix-dgram';

const socketPath = process.argv[2] || '/tmp/watchdog.sock';

if (fs.existsSync(socketPath)) {
  console.error(`Socket path ${socketPath} already exists; check for existing server or remove socket file.`);
  process.exit(1);
}

const server = unix.createSocket('unix_dgram', (buf: Buffer) => {
  console.log('Received:', buf.toString());
});

server.bind(socketPath);
console.log('Bound to', socketPath);

function closeServer(): void {
  console.log();
  console.log('Closing server');
  server.close();
  fs.unlinkSync(socketPath);
}

process.on('SIGINT', closeServer);
process.on('SIGTERM', closeServer);
