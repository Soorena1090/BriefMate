import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE_DB } from '../database/database.constans.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { briefs, projects, schema } from '../database/schema.js';
import { and, eq } from 'drizzle-orm';
import { CreateBriefDto } from './dto/create-brief.dto.js';
import { UpdateBriefDto } from './dto/update-brief.dto.js';

@Injectable()
export class BriefsService {
    constructor(
        @Inject(DRIZZLE_DB)
        private readonly db: NodePgDatabase<typeof schema>,
    ) { }

    private async ensureOwnedProject(
        userId: string,
        projectId: string,
    ) {
        const [project] = await this.db.select({ id: projects.id }).from(projects).where(and(
            eq(projects.id, projectId),
            eq(projects.userId, userId),
        ),
        ).limit(1);
        if(!project) {
            throw new NotFoundException('Project not found');
        }
    }

    async create(
        userId: string,
        projectId: string,
        dto: CreateBriefDto,
    ) {
        await this.ensureOwnedProject(userId, projectId);

        const [existingBrief] = await this.db.select(({ id: briefs.id })).from(briefs).where(eq(briefs.projectId, projectId)). limit(1);

        if (existingBrief) {
            throw new ConflictException('This project already has a brief',);
        }

        const [brief] = await this.db.insert(briefs).values({
            projectId,
            content: dto.content,
        }).returning();
        return brief
    }

    async findOne(userId: string, projectId: string) {
        await this.ensureOwnedProject(userId, projectId);

        const [brief] = await this.db.select().from(briefs).where(eq(briefs.projectId, projectId)).limit(1);

        if (!brief) {
            throw new NotFoundException('Brief not found');
        }
        return brief
    }

    async update(
        userId: string,
        projectId: string,
        dto: UpdateBriefDto,
    ) {
        await this.ensureOwnedProject(userId, projectId);

        const [updateBrief] = await this.db.update(briefs).set({
            content: dto.content,
            updatedAt: new Date(),
        }).where(eq(briefs.projectId, projectId)).returning();

        if (!updateBrief) {
            throw new NotFoundException('Brief not found');
        }
        return updateBrief;
    }

    async remove(userId: string, projectId: string) {
        await this.ensureOwnedProject(userId, projectId);

        const [deletedBrief] = await this.db.delete(briefs).where(eq(briefs.projectId, projectId)).returning();

        if (!deletedBrief) {
            throw new NotFoundException('Brief not found');
        }

        return {
            message: 'Brief deleted successfully',
            brief: deletedBrief,
        };
    }
}
