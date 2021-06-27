import { Laptop } from './types';

import { shopSrapper } from './shopI';
import { MoreleScrapper } from './shops/morele';
import { MediaExpertScrapper } from './shops/mediaexpert';
import { Database } from './database';
import Logger from './logger';

const logger = new Logger('SCRAPPER'.bgMagenta, 'GENERAL');

function validateElement(e: Laptop): boolean {
    if(!Number.isFinite(e.price)) return false;
    if(!Number.isFinite(e.RAM)) return false;
    if(!e.cpu) return false;
    if(!e.gpu) return false;
    if(!e.name) return false;
    if(!e.url) return false;
    for(let d of e.disks)
        if(!Number.isFinite(d.size)) return false;
    return true;
}

const db = new Database();

async function scrap(scrappers: Array<shopSrapper>): Promise<void> {
    scrappers.forEach((scrapper) => {
        scrapper.scrapAll(async (res) => {
            res = res.filter(validateElement);
            scrapper.savedNum += res.length;
            if (res.length > 0)
                db.addEntries(res);
        });
    })
}
function scrapAll(){
    scrap([new MediaExpertScrapper, new MoreleScrapper]);
}

//run scrap everyday at 12
async function timer(){
    logger.info("STARTING TODAY's SCRAPPING");
    scrapAll();
    let now = new Date();
    let millisTill12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0).getTime() - now.getTime();
    if (millisTill12 < 0)
        millisTill12 += 86400000; // it's after 10am, try 10am tomorrow.
    setTimeout(()=>{
        timer();
    }, millisTill12);
}
timer();