import {
    Inject,
    Injectable,
    OnModuleDestroy,
} from '@nestjs/common';

import { Pool } from 'pg';
import { PG_POOL } from './database.constans.js';

//checking for connection
@Injectable()
export class DatabaseService implements OnModuleDestroy {
    constructor(
        @Inject(PG_POOL)
        private readonly pool: Pool,
    ) {}

    async checkConnection() {
        const result: any = await this.pool.query(
            'SELECT NOW() AS now',
        );
        return result.rowCount[0];
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}


