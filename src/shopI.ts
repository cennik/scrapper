import { EmptyLaptop, Laptop } from "./types";
import 'colorts/lib/string';

export abstract class shopSrapper {
    scrappedNum = 0;
    savedNum = 0;
    site = 1;
    last = EmptyLaptop;
    async scrapAll(scrapped: (res: Laptop[]) => Promise<void>): Promise<void> {
        while (true) {
            try {
                let els = await this.scrapSite();
                if (this.shouldEnd(els)) {
                    return;//end of pages
                } else {
                    this.scrappedNum += els.length;
                    scrapped(els);
                    this.site++;
                    this.last = els[els.length - 1];
                }
            } catch (err) {
                console.error(this.constructor.name.yellow.bold, `error scrapping site ${this.site}, trying again...`.bgRed);
            }
        }
    }
    shouldEnd(els: Array<Laptop>) {
        return els.length == 0 || (this.scrappedNum > 0 && els[els.length - 1].url == this.last.url);
    }
    abstract scrapSite(): Promise<Array<Laptop>>;
};