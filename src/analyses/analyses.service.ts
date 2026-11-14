import { Inject, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { DRIZZLE_DB } from '../database/database.constans.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AiService } from '../ai/ai.service.js';
import { ConfigService } from '@nestjs/config';
import { analyses, briefs, projects, schema } from '../database/schema.js';
import { and, desc, eq } from 'drizzle-orm';
import { BRIEF_ANALYSIS_PROMPT } from '../ai/prompts/brief-analysis.prompt.js';
import { briefAnalysisSchema } from '../ai/schemas/brief-analysis.schema.js';

@Injectable()
export class AnalysesService {
    constructor(
        @Inject(DRIZZLE_DB)
        private readonly db: NodePgDatabase<typeof schema>,

        private readonly aiService: AiService,

        private readonly configService: ConfigService,
    ) {}

    async analyzeBrief(
        userId: string,
        projectId: string,
    ) {
        const [project] = await this.db.select({ id: projects.id }).from(projects).where(
            and(
                eq(projects.id, projectId),
                eq(projects.userId, userId),
            ),
        ).limit(1);

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        const [brief] = await this.db.select().from(briefs).where(eq(briefs.projectId, projectId)).limit(1);

        if (!brief) {
            throw new NotFoundException('Brief not found');
        }

        const rawResponse = await this.aiService.generateJson(
            BRIEF_ANALYSIS_PROMPT,
            `Analyze the following project brief:\n\n${brief.content}`,
        );

        let parsedResponse: unknown;

        try {
            parsedResponse = JSON.parse(rawResponse);
        } catch {
            throw new ServiceUnavailableException(
                'AI returned invalid JSON'
            );
        }

        const validationResult = briefAnalysisSchema.safeParse(parsedResponse);

        if (!validationResult.success) {
            console.error(
                'AI Validation Error:',
                JSON.stringify(validationResult.error.issues, null, 2),
            );

            console.error(
                'AI Raw Response:',
                JSON.stringify(parsedResponse, null, 2),
            );

            throw new ServiceUnavailableException(
                'AI returned an invalid analysis structure.',
            );
        }

        const result = validationResult.data;

        const model = this.configService.getOrThrow<string>('GROQ_MODEL');

        const [analysis] = await this.db.insert(analyses).values({
            projectId,
            briefId: brief.id,
            summary: result.summary,
            requirements: result.requirements,
            questions: result.questions,
            model,
        }).returning();

        return analysis;
    }


    async findAll(
        userId: string,
        projectId: string,
    ) {
        const [project] = await this.db.select({ id: projects.id }).from(projects).where(
            and(
                eq(projects.id, projectId),
                eq(projects.userId, userId),
            ),
        ).limit(1);

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return this.db.select().from(analyses).where(eq(analyses.projectId, projectId)).orderBy(desc(analyses.createdAt));
    }
}
