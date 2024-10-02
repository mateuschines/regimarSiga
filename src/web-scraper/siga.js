import puppeteer from 'puppeteer';
import os from 'os';
import path from "path";

export async function SigaScraper(nomeProduto) {
    let executablePath;
    let userDataDir;

    if (os.platform() === 'win32') {
        executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'; // Windows
        userDataDir = path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'User Data');
    } else if (os.platform() === 'linux') {
        executablePath = '/usr/bin/google-chrome'; // Linux
        userDataDir = path.join(os.homedir(), '.config', 'google-chrome');
    } else if (os.platform() === 'darwin') {
        executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'; // macOS
        userDataDir = path.join(os.homedir(), 'Library', 'Application Support', 'Google', 'Chrome');
    }

    console.log(executablePath)
    console.log('---------------------------')
    console.log(userDataDir)

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--no-sandbox", "--window-size=1920,1080"],
        // executablePath: executablePath,
        // userDataDir: userDataDir
    });

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

    console.log('goto')
    const page = await browser.newPage();

    try {



        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9'
        });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');

        await page.goto(`https://siga.congregacao.org.br`);

        // Espera o elemento de input com o XPath //*[@id="f_usuario"]
        const inputXPath = '//*[@id="f_usuario"]';
        await page.waitForXPath(inputXPath); // Aguarda o elemento aparecer na página

        // Seleciona o input com o XPath e digita o texto
        const inputElement = await page.$x(inputXPath);
        await inputElement[0].type('mateus.chines');

        // Espera o elemento de input com o XPath //*[@id="f_senha"]
        const inputPassXPath = '//*[@id="f_senha"]';
        await page.waitForXPath(inputPassXPath); // Aguarda o elemento aparecer na página

        // Seleciona o input com o XPath e digita o texto
        const inputPassElement = await page.$x(inputPassXPath);
        await inputPassElement[0].type('123');


        // await page.close();
        // await browser.close();

        // return produto;
    } catch (error) {
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