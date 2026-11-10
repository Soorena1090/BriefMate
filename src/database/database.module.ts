import { Module } from "@nestjs/common";
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

import { schema } from './schema.js';
import { PG_POOL, DRIZZLE_DB } from "./database.constans.js";
import { DatabaseService } from "./database.service.js";

@Module({
    providers: [
        {
            provide: PG_POOL,
            useFactory: () => {
                return new Pool({
                    connectionString: process.env.DATABASE_URL,
                });
            },
        },
        {
            provide: DRIZZLE_DB,
            useFactory: (pool: Pool) => {
                return drizzle(pool, { schema });
            },
            inject: [PG_POOL],
        },
        DatabaseService,
    ],
    exports: [DRIZZLE_DB, DatabaseService],
})

export class DatabaseModule {}