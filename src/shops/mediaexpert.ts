import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { Disk, Laptop, EmptyLaptop, getDiskType, ShopId } from '../types';
import { shopSrapper } from '../shopI';

export class MediaExpertScrapper extends shopSrapper {
    static url = 'https://www.mediaexpert.pl/komputery-i-tablety/laptopy-i-ultrabooki/laptopy?limit=50';
    scrapSite(): Promise<Array<Laptop>> {
        return new Promise((resolve, reject) => {
            fetch(`${MediaExpertScrapper.url}&page=${this.site}`).then(res=>res.text()).then((html) => {
                const $ = cheerio.load(html);
                let els = $('.offer-box').toArray();
                let res: Array<Laptop> = els.map(el => {
                    try {
                        let name = cheerio.default.text($('.is-heading.name.is-heading-section', el)).trim();
                        let url = 'https://www.mediaexpert.pl' + $('.is-heading.name.is-heading-section a', el)[0].attribs.href;
                        let cpu = cheerio.default.text([$('li:contains("Procesor").item .attribute-values.values.attribute', el)[0]]).trim();
                        let gpu = cheerio.default.text([$('li:contains("Karta graficzna").item .attribute-values.values.attribute', el)[0]]).trim();
                        let RAM = parseInt(cheerio.default.text([$('li:contains("RAM").item .attribute-values.values.attribute', el)[0]]).trim());
                        let diskData = cheerio.default.text([$('li:contains("Dysk").item .attribute-values.values.attribute', el)[0]]).trim();
                        let disks: Array<Disk> = [{
                            size: parseInt(diskData),
                            type: getDiskType(diskData.split(' ').slice(-1)[0]),
                        }];
                        let prices = $('.main-price .whole', el);
                        let price = Math.min(...prices.toArray().map((p) => parseInt(cheerio.default.text([p]).replace(/\s/g, ''))));
                        return { name, url, cpu, gpu, RAM, disks, price, shop: ShopId.MediaExpert };
                    } catch (err) {
                        return EmptyLaptop;
                    }
                });
                resolve(res);
            }).catch(function (err) {
                reject(err);
            });
        });
    }
}