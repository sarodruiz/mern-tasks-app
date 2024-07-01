import express from 'express';
import router from './routes.js';
import cors from 'cors';
import { connectToMongoDB } from './database.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, "build")));
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, "build/index.html"));
});

app.use(cors());
app.use(express.json());
app.use('/api', router);

async function startServer() {
    await connectToMongoDB();
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

await startServer();
