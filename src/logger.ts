import 'colorts/lib/string';
import fs from 'fs';

export default class Logger{
    name:string;
    filePrefix:string;
    constructor(name:string, filePrefix: string){
        this.name = name;
        this.filePrefix = filePrefix;
    }
    debug(...msgs:Array<string>){
        console.debug(`${this.name}: `, msgs.join(' ').gray);
        this.writeToFile('debug', ...msgs);
    }
    log(...msgs:Array<string>){
        console.log(`${this.name}: `, msgs.join(' ').green);
        this.writeToFile('log', ...msgs);
    }
    info(...msgs:Array<string>){
        console.info(`${this.name}: `, msgs.join(' ').blue);
    }
    error(...msgs:Array<string>){//TODO save to file
        console.error(`${this.name}: `, msgs.join(' ').red);
        this.writeToFile('error', ...msgs);
    }

    async writeToFile(fileSuffix:string, ...msgs:Array<string>){
        let path = `./logs/${this.filePrefix}-${fileSuffix}.log`;
        try {
            if (fs.existsSync(path)) {
                let val = fs.readFileSync(path);
                fs.writeFileSync(path, `${val}\r\n[${new Date().toLocaleString()}]: ${msgs.join(' ')}`);
            }else{
                fs.writeFileSync(path, `[${new Date().toLocaleString()}]: ${msgs.join(' ')}`);
            }
        } catch(err) {
            console.error('LOGGER, ERROR WHILE WRITING TO FILE: '.bgRed.yellow, err);
        }
    }
}