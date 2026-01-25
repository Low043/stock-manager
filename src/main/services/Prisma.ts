import { PrismaClient } from '../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { singleton } from 'tsyringe';
import { app } from 'electron';

@singleton()
export class PrismaService extends PrismaClient {
    private static dbPath: string = 'file:' + app.getPath('userData') + '/stock-manager.db';

    constructor() {
        super({ adapter: new PrismaLibSql({ url: PrismaService.dbPath }) });
    }
}
