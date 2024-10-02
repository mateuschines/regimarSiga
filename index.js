import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { GazinScraper } from './src/web-scraper/gazin.js';
import { MercadoLivreScraper } from './src/web-scraper/mercado-livre.js';
import { AmazonScraper } from './src/web-scraper/amazon.js';
import { engine } from 'express-handlebars';
import { SigaScraper } from './src/web-scraper/siga.js';
import { SigaCoreScraper } from './src/web-scraper/siga-core.js';

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

app.engine('handlebars', engine({
    layoutsDir: './src/views',
    defaultLayout: 'home'
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.get('/', (req, res) => {
    res.render('home');
});


const scrapers = [
    // { name: 'Mercado livre', scraper: MercadoLivreScraper },
    // { name: 'Amazon', scraper: AmazonScraper },
    // { name: 'Gazin', scraper: GazinScraper },
    { name: 'Siga', scraper: SigaScraper },
    // { name: 'SigaCore', scraper: SigaCoreScraper },
];

scrapers.forEach(async ({ name, scraper }) => {
    const resultado = await scraper('produtoNome');

    console.log(JSON.stringify({ source: name, data: resultado }))
    // ws.send(JSON.stringify({ source: name, data: resultado }));
});

wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    ws.on('message', async (message) => {
        const produtoNome = message.toString();
        console.info(`Buscando produto: ${produtoNome}`);

        const scrapers = [
            // { name: 'Mercado livre', scraper: MercadoLivreScraper },
            // { name: 'Amazon', scraper: AmazonScraper },
            // { name: 'Gazin', scraper: GazinScraper },
            // { name: 'Siga', scraper: SigaScraper },
            { name: 'SigaCore', scraper: SigaCoreScraper },
        ];

        scrapers.forEach(async ({ name, scraper }) => {
            const resultado = await scraper(produtoNome);
            ws.send(JSON.stringify({ source: name, data: resultado }));
        });
    });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});