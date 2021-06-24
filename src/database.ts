
import mysql, { Connection, FieldInfo, Query, QueryOptions } from 'mysql';
import dbcfg from '../config/db.json';

import Queue from 'queue-promise';
import { Laptop } from './types';
import 'colorts/lib/string';

export class Database {
    static log(...msgs: Array<string>) {
        console.log('MYSQL'.cyan.bold, ...msgs);
    }
    queue: Queue;
    con: Connection;
    constructor() {
        this.queue = new Queue({ concurrent: 1, interval: 100 });
        this.queue.on('resolve', (res) => { });
        this.queue.on('reject', (e) => Database.log(JSON.stringify(e).red));
        this.con = mysql.createConnection({ ...dbcfg, multipleStatements: true });
        this.connect();
    }
    async connect(): Promise<void> {
        this.con.connect((err) => {
            if (err) Database.log(err.name.bgRed);
            Database.log("connected");
        });
    }
    query(query: string, values?: Array<any>): Promise<{ results?: any, fields?: Array<FieldInfo> }> {
        return new Promise((resolve, reject) => {
            this.con.query(query, values, (err, results, fields) => {
                if (err) return reject(err);
                return resolve({ results, fields });
            })
        })
    }
    addEntries(entries: Array<Laptop>) {
        let query = entries.map(e => {
            let query = 'INSERT INTO entries(`url`, `name`, `cpu`, `gpu`, `ram`, `price`, `shopId`) VALUES(?,?,?,?,?,?,?);SET @entryId = LAST_INSERT_ID();';
            e.disks.forEach(disk => query += 'INSERT INTO entryDisks(type,size,entryID) VALUES(?, ?, @entryId);');
            return query;
        }).join('');
        let values: Array<number | string> = [];
        entries.forEach(e => {
            let vals = [e.url, e.name, e.cpu, e.gpu, e.RAM, e.price, e.shop];
            e.disks.forEach(disk => vals.push(...[disk.type, disk.size]));
            values.push(...vals);
        });
        this.queue.enqueue(() => this.query(query, values));
    }
}