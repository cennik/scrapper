import 'colorts/lib/string';

export default class Logger{
    name:string;
    constructor(name:string){
        this.name = name;
    }
    debug(...msgs:Array<string>){
        console.debug(`${this.name}: `, msgs.join(' ').gray);
    }
    log(...msgs:Array<string>){
        console.log(`${this.name}: `, msgs.join(' ').green);
    }
    info(...msgs:Array<string>){
        console.info(`${this.name}: `, msgs.join(' ').blue);
    }
    error(...msgs:Array<string>){//TODO save to file
        console.error(`${this.name}: `, msgs.join(' ').red);
    }
}