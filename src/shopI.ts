import { EmptyLaptop, Laptop } from "./types";
import Logger from "./logger";

export abstract class shopSrapper {
    scrappedNum = 0;
    savedNum = 0;
    site = 1;
    last = EmptyLaptop;
    logger = new Logger(`${this.constructor.name}:`.bgGreen, this.constructor.name);
    async scrapAll(scrapped: (res: Laptop[]) => Promise<void>): Promise<void> {
        while (true) {
            try {
                let els = await this.scrapSite();
                if (this.shouldEnd(els)) {
                    this.logger.log(`finished with ${this.savedNum} saved and ${this.scrappedNum} at all`);
                    return;//end of pages
                } else {
                    this.scrappedNum += els.length;
                    scrapped(els);
                    this.site++;
                    this.last = els[els.length - 1];
                    this.logger.debug(`scrapped ${els.length}, ${this.savedNum} saved and ${this.scrappedNum} at all`);
                }
            } catch (err) {
                this.logger.error(`error scrapping site ${this.site}, trying again...`);
            }
        }
    }
    shouldEnd(els: Array<Laptop>) {
        return els.length == 0 || (this.scrappedNum > 0 && els[els.length - 1].url == this.last.url);
    }
    abstract scrapSite(): Promise<Array<Laptop>>;
};