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

async function scrap(scrappers: Array<shopSrapper>): Promise<void> {
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
function scrapAll(){
    scrap([new MediaExpertScrapper, new MoreleScrapper]);
}


//run scrap everyday at 12
async function timer(){
    console.log("STARTING TODAY's SCRAPPING".bgMagenta);
    let now = new Date();
    let millisTill12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0).getTime() - now.getTime();
    if (millisTill12 < 0)
        millisTill12 += 86400000; // it's after 10am, try 10am tomorrow.
    setTimeout(()=>{
        timer();
        scrapAll();
    }, millisTill12);
}
timer();