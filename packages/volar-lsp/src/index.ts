import { language } from "./languagePlugin";
import { languageServicePlugin } from "./languageServicePlugin";
import {
  createServer,
  createConnection,
  createSimpleProject,
} from "@volar/language-server/node";

const connection = createConnection();
const server = createServer(connection);

connection.listen();

connection.onInitialize((params) => {
  return server.initialize(
    params,
    createSimpleProject([  
        language
    ]),
    [
        languageServicePlugin
    ]
  );
});

connection.onInitialized(server.initialized);
connection.onShutdown(server.shutdown);