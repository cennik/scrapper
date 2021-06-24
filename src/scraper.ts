import 'colorts/lib/string';

import { Laptop } from './types';

import { shopSrapper } from './shopI';
import { MoreleScrapper } from './shops/morele';
import { MediaExpertScrapper } from './shops/mediaexpert';
import { Database } from './database';


function validateElement(e: Laptop): boolean {
    return Number.isFinite(e.price);
}

const db = new Database();

function scrapAll(scrappers: Array<shopSrapper>): void {
    scrappers.forEach((scrapper) => {
        scrapper.scrapAll(async (res) => {
            res = res.filter(validateElement);
            scrapper.savedNum += res.length;
            if (res.length > 0)
                db.addEntries(res);
            console.log(`${scrapper.constructor.name}:`.yellow.bold, `scrapped ${res.length}, ${scrapper.savedNum} saved and ${scrapper.scrappedNum} at all`.bgBlue);
        }).then(() => {
            console.log(`${scrapper.constructor.name}:`.yellow.bold, `finished with ${scrapper.savedNum} saved and ${scrapper.scrappedNum} at all`.bgGreen);
        })
    })
}

scrapAll([new MediaExpertScrapper, new MoreleScrapper]);