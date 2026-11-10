import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { DRIZZLE_DB } from '../database/database.constans.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { projects, schema } from '../database/schema.js';
import { and, desc, eq } from 'drizzle-orm';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
    constructor(
        @Inject(DRIZZLE_DB)
        private readonly db: NodePgDatabase<typeof schema>,
    ) { }

    async create(userId: string, dto: CreateProjectDto) {
        const [project] = await this.db.insert(projects).values({
            userId,
            title: dto.title,
            description: dto.description,
            status: dto.status ?? 'draft',
        }).returning();
        return project;
    }

    async findAll(userId: string) {
        return this.db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
    }

    async findOne(userId: string, projectId: string) {
        const [project] = await this.db.select().from(projects).where(and(
            eq(projects.id, projectId),
            eq(projects.userId, userId),
        ),
        ).limit(1);

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }


    async update(
        userId: string,
        projectId: string,
        dto: UpdateProjectDto
    ) {
        await this.findOne(userId, projectId);

        const [updatedProject] = await this.db.update(projects).set({
            ...dto,
            updatedAt: new Date(),
        }).where(and(
            eq(projects.id, projectId),
            eq(projects.userId, userId),
        ),
        ).returning();
        return updatedProject;
    }


    async remove(userId: string, projectId: string) {
        await this.findOne(userId, projectId);

        const [deletedProject] = await this.db.delete(projects).where(and(
            eq(projects.id, projectId),
            eq(projects.userId, userId),
        ),
        ).returning();
        return {
            message: 'Project deleted successfully',
            project: deletedProject,
        };
    }
}
