import puppeteer from 'puppeteer-core';
import path from "path";

export async function SigaCoreScraper(nomeProduto) {

    // Texto para o chat
    /**
     oi amigo, estou aprendendo a programar em javascript, e quero sua ajuda para desenvolver um software nessa linguagem.
     ja tenho em mente, estou fazendo um webScraping de um site especifico, para melhorar uma rotina no trabalho.
     começei usando puppeteer, mas não conheço muito ela, gostaria de usar uma aba do navegador que eu ja abri, e que ela continuasse a usar.
     */

    //Abrir chome no linux
    //  google-chrome --remote-debugging-port=9222

    // Abrir chrome no windows
    // chrome --remote-debugging-port=9222


    try {
        const browserURL = 'http://localhost:9222'; // Conecte-se ao navegador em execução
        const browser = await puppeteer.connect({
            browserWSEndpoint: browserURL
        });

        const pages = await browser.pages(); // Obtém todas as abas abertas
        const page = pages[0]; // Seleciona a primeira aba

        // await page.goto(`https://siga.congregacao.org.br`);
        console.log('deu bao')

    } catch (error) {
        console.error('erro');
        console.error(error);

        const { NODE_ENV } = process.env;

        if (NODE_ENV === "dev") {
            const imageName = `amazon-${Date.now()}.png`
            const errorImagePath = path.join("src", "bugs_images", imageName);

            await page.screenshot({ path: errorImagePath });
        }

        await page.close();
        await browser.close();

        return null;
    }
}