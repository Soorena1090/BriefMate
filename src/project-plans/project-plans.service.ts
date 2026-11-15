import { Inject, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { DRIZZLE_DB } from '../database/database.constans.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { analyses, briefs, projectPlans, projects, schema } from '../database/schema.js';
import { AiService } from '../ai/ai.service.js';
import { ConfigService } from '@nestjs/config';
import { and, desc, eq } from 'drizzle-orm';
import { PROJECT_PLAN_SYSTEM_PROMPT } from '../ai/prompts/project-plan.prompt.js';
import { projectPlanSchema } from '../ai/schemas/project-plan.schema.js';

@Injectable()
export class ProjectPlansService {
    constructor(
        @Inject(DRIZZLE_DB)
        private readonly db: NodePgDatabase<typeof schema>,

        private readonly aiService: AiService,

        private readonly configService: ConfigService,
    ) { }


    async generate(userId: string, projectId: string) {
        const [project] = await this.db.select().from(projects).where(and(
            eq(projects.id, projectId),
            eq(projects.userId, userId),
        ),
        ).limit(1);

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        const [analysis] = await this.db.select().from(analyses).where(eq(analyses.projectId, projectId)).orderBy(desc(analyses.createdAt)).limit(1);

        if (!analysis) {
            throw new NotFoundException(
                'No analysis found. Analyze the project brief first.',
            );
        }

        const [brief] = await this.db.select().from(briefs).where(eq(briefs.id, analysis.briefId)).limit(1);

        if (!brief) {
            throw new NotFoundException('Brief not found');
        }

        const userPrompt = `
        Project title:
        ${project.title}
        
        Project description:
        ${project.description ?? 'Not provided'}
        
        Original brief:
        ${brief.content}
        
        AI analysis:
        ${JSON.stringify({
            summary: analysis.summary,
            requirements: analysis.requirements,
            questions: analysis.questions,
        })}
        
        
        Create a project implementation plan.
        `;


        const rawResponse = await this.aiService.generateJson(
            PROJECT_PLAN_SYSTEM_PROMPT,
            userPrompt,
        );

        console.log('PROJECT PLAN RAW RESPONSE:', rawResponse);

        let parsedResponse: unknown;

        try {
            parsedResponse = JSON.parse(rawResponse);
        } catch {
            throw new ServiceUnavailableException(
                'AI returned invalid JSON',
            );
        }

        const validation = projectPlanSchema.safeParse(parsedResponse);

        if (!validation.success) {
            console.error(
                'PROJECT PLAN VALIDATION ERRORS:',
                JSON.stringify(validation.error.issues, null, 2),
            );

            console.error(
                'AI RESPONSE KEYS:',
                Object.keys(
                    parsedResponse as Record<string, unknown>,
                ),
            );

            throw new ServiceUnavailableException(
                'AI returned an invalid project plan structure',
            );
        }

        const result = validation.data;

        const [savedPlan] = await this.db.insert(projectPlans).values({
            projectId,
            analysesId: analysis.id,
            title: result.title,
            overview: result.overview,
            phases: result.phases,
            deliverables: result.deliverables,
            assumptions: result.assumptions,
            risks: result.risks,
            model: this.configService.getOrThrow<string>('GROQ_MODEL'),
        }).returning();
        return savedPlan;
    }

    async findAll(userId: string, projectId: string) {
        const [project] = await this.db.select({ id: projects.id }).from(projects).where(and(
            eq(projects.id, projectId),
            eq(projects.userId, userId),
        ),
        ).limit(1);

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return this.db.select().from(projectPlans).where(eq(projectPlans.projectId, projectId)).orderBy(desc(projectPlans.createdAt));
    }
}
