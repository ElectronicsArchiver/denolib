
import { server } from '../mod.ts';

server.staticdir = './';

await server.run({ port : 8080 });
