import {launch} from 'puppeteer';
import {uploadToBlob} from "./azure";
import moment = require("moment");


export interface CarHeader {
    finnkode: string;
    location?: string;
    title?: string;
    year?: string;
    km?: string;
    price?: string;
    url?: string;
}

export interface CarDetail {
    finnkode: string;
    equipment?: string;
    properties?: Map<string, string>;
}


const urls = ['https://www.finn.no/car/used/search.html?year_from=2007&body_type=4&rows=10&page=1'];
// const urls = ['https://www.finn.no/car/used/search.html?year_from=2007&body_type=4&rows=100&page=1','https://www.finn.no/car/used/search.html?year_from=2007&body_type=4&rows=100&page=2','https://www.finn.no/car/used/search.html?year_from=2007&body_type=4&rows=100&page=2000', ,'https://www.finn.no/car/used/search.html?year_from=2007&body_type=4&rows=100&page=3'];

async function main() {
    let carHeaders, carDetails;
    try {
        carHeaders = await getHeaders();
        const currDate = moment();
        uploadToBlob(JSON.stringify(carHeaders), 'finncars', currDate.format('YYYY') + '/' + currDate.format('MM') + '/' + currDate.format('DD') + '/' + 'headers.json').then(() => console.log("Done")).catch((e) => console.log(e));

        carDetails = await getDetails(carHeaders);
        uploadToBlob(JSON.stringify(carDetails), 'finncars', currDate.format('YYYY') + '/' + currDate.format('MM') + '/' + currDate.format('DD') + '/' + 'details.json').then(() => console.log("Done")).catch((e) => console.log(e));

    } catch(e) {

        console.error('Error extracting carHeaders', e);
    }



}

async function getHeaders() {
    const browser = await launch({ headless: true});
    const page = await browser.newPage();
    let carHeaders: CarHeader[] = [];
    let i=0;
    let numResults = 100;
    while (i<urls.length && numResults > 1){ //numResults === 1 returned as results indicates that we have reached the end
        let url = urls[i];
        await page.goto(url, {waitUntil: 'networkidle2'});
        const carHeadersPage: CarHeader[] = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.ads__unit__content'))
                .map((e:Element) => {

                    const carHeader: CarHeader = {
                        finnkode: e.querySelector('h2 a').getAttribute('data-finnkode'),
                        url: e.querySelector('h2 a')['href'],
                        title: e.querySelector('h2 a').textContent
                    };
                    return carHeader;
                })); //can only return serialized values

        numResults = carHeadersPage.length;
        carHeaders = carHeaders.concat(carHeadersPage);
        i++;
    }

    browser.close();
    return carHeaders;
}

export async function getDetails(carHeaders: CarHeader[]) {
    const browser = await launch({ headless: true});
    const page = await browser.newPage();
    let carDetails: CarDetail[] = [];

    for (let i=0; i< carHeaders.length; i++ ){
        await page.goto(carHeaders[i].url, {waitUntil: 'networkidle2'});
        const carDetailsPage: CarDetail[] = await page.evaluate(() => {
            const carDetail: CarDetail = {
                finnkode: this.href,
                properties: new Map()
            };

            carDetails = Array.from(document.querySelectorAll('.list--bullets li'))
                .map((e:Element) => {
                    carDetail.equipment = carDetail.equipment + e.innerHTML;

                    return carDetail;
                });

            carDetails = Array.from(document.querySelectorAll('.definition-list--cols1to2 dt'))
                .map((e:Element) => {
                    console.log('DT', e.innerHTML);
                    console.log('DD', e.nextElementSibling.innerHTML);
                    carDetail.properties = carDetail.properties.set(e.innerHTML, e.nextElementSibling.innerHTML);

                    return carDetail;
                });


            console.log(carDetails);
            return carDetails;
        });


        //can only return serialized values



        carDetails = carDetails.concat(carDetailsPage);
    }

    browser.close();
    return carDetails;
}




main();




