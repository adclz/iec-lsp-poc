import { createConnection } from 'vscode-languageserver/node';
import { startServer } from '../common/server';

const connection = createConnection();

startServer(connection);