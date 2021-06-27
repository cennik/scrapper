import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { Disk, Laptop, DiskType, ShopId } from '../types';
import { shopSrapper } from '../shopI';



export class MoreleScrapper extends shopSrapper {
    static url = 'https://www.morele.net/kategoria/laptopy-31/,,,,,,,,0,,,,/'; 
    static parseDisk(s: string, t: DiskType): Array<Disk> {
        if (s.includes('2x')) {
            let size = parseInt(s.split(' ')[1]);
            return [{ size, type: t }, { size, type: t }]
        } else {
            let size = parseInt(s.split(' ')[0]);
            return [{ size, type: t }]
        }
    }
    scrapSite(): Promise<Array<Laptop>> {
        return new Promise((resolve, reject) => {
            fetch(MoreleScrapper.url + this.site).then(res=>res.text()).then((html) => {
                const $ = cheerio.load(html);
                let els = $('.cat-product-name .productLink').toArray();
                let urls: Array<string> = els.map(el => {
                    try {
                        let url: string = 'https://www.morele.net' + el.attribs.href;
                        return url;
                    } catch (err) { return '' }
                });
                let res: Array<Laptop> = [];
                function scrapLaptop(i: number, tried?: boolean) {
                    if (i >= urls.length) return resolve(res);
                    fetch(urls[i]).then(res=>res.text()).then((html) => {
                        try {
                            const $ = cheerio.load(html);
                            let name = cheerio.default.text($('.prod-name'));
                            let url = urls[i];
                            let cpu = cheerio.default.text($('.table-info-item:contains("Procesor") .info-item')).trim();
                            let gpu = cheerio.default.text($('.table-info-item:contains("Dedykowany układ graficzny") .info-item')).trim();
                            if (gpu == 'Brak') gpu = cheerio.default.text($('.table-info-item:contains("Zintegrowany układ graficzny") .info-item')).trim();
                            let RAM = parseInt(cheerio.default.text($('.table-info-item:contains("Pamięć RAM (zainstalowana)") .info-item')).trim());

                            let disks: Array<Disk> = [];
                            let HDD = cheerio.default.text($('.table-info-item:contains("Dysk HDD") .info-item')).trim();
                            if (HDD != 'Brak') disks.push(...MoreleScrapper.parseDisk(HDD, 'HDD'));
                            let SSD = cheerio.default.text($('.table-info-item:contains("Dysk SSD") .info-item')).trim();
                            if (SSD != 'Brak') disks.push(...MoreleScrapper.parseDisk(SSD, 'SSD'));
                            let SSDM2 = cheerio.default.text($('.table-info-item:contains("Dysk SSD M.2") .info-item')).trim();
                            if (SSDM2 != 'Brak') disks.push(...MoreleScrapper.parseDisk(SSDM2, 'SSD'));
                            let SSDM2PCIe = cheerio.default.text($('.table-info-item:contains("Dysk SSD M.2 PCIe") .info-item')).trim();
                            if (SSDM2PCIe != 'Brak') disks.push(...MoreleScrapper.parseDisk(SSDM2PCIe, 'SSD'));

                            let price = parseInt(cheerio.default.text($('.product-price')).replace(/\s/g, ''));
                            res.push({ name, url, cpu, gpu, RAM, disks, price, shop: ShopId.Morele });
                        } catch (err) { }
                        scrapLaptop(i + 1);
                    }).catch(err => {
                        if(tried)
                            return reject(err);
                        scrapLaptop(i, true);//made to handle antiddos
                    });
                }
                scrapLaptop(0);
            }).catch(function (err) {
                reject(err);
            });
        });
    }
}