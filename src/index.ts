import {launch} from 'puppeteer';

console.log('test2')

export interface CarHeader {
    finnkode: string;
    location?: string;
    title?: string;
    year?: string;
    km?: string;
    price?: string;
    url?: string;
}



const urls = ['https://www.finn.no/car/used/search.html?year_from=2007&body_type=4&rows=100&page=1','https://www.finn.no/car/used/search.html?year_from=2007&body_type=4&rows=100&page=2','https://www.finn.no/car/used/search.html?year_from=2007&body_type=4&rows=100&page=2000', ,'https://www.finn.no/car/used/search.html?year_from=2007&body_type=4&rows=100&page=3'];

async function main() {
    const browser = await launch({ headless: true});
    const page = await browser.newPage();
    let carHeaders: CarHeader[] = [];
    let i=0;
    let numResults = 999; //numResults === 1 returned as results indicates that we have reached the end
    while (i<urls.length && numResults > 1){
        let url = urls[i];
        await page.goto(url, {waitUntil: 'networkidle2'});
        const carHeadersPage: CarHeader[] = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.ads__unit__content'))
                .map((e) => {
                    const carHeader: CarHeader = {
                        finnkode: e.querySelector('h2 a').getAttribute('data-finnkode'),
                        url: e.querySelector('h2 a')['href'],
                        title: e.querySelector('h2 a').textContent
                    };
                    console.log(carHeader);
                    return carHeader;
                })); //can only return serialized values

        numResults = carHeadersPage.length;
        carHeaders = carHeaders.concat(carHeadersPage);
        i++;

    }
    console.log(carHeaders.length);
    browser.close();
}

main();




