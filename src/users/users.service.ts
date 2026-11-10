import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_DB } from '../database/database.constans.js';
import { schema, users } from '../database/schema.js';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class UsersService {
    constructor(
        @Inject(DRIZZLE_DB)
        private readonly db: NodePgDatabase<typeof schema>,
    ){}

    async findByEmail(email: string) {
        const [user] = await this.db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        return user ?? null;
    }

    async findById(id: string) {
        const [user] = await this.db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        return user ?? null;
    }


    async create(data: {
        email: string,
        passwordHash: string;
    }) {
        const [user] = await this.db
            .insert(users)
            .values(data)
            .returning({
                id: users.id,
                email: users.email,
                createdAt: users.createdAt,
            });
            return user
    }
}
