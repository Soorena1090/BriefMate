import { Inject, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { DRIZZLE_DB } from '../database/database.constans.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { analyses, briefs, projectPlans, projects, proposals, schema } from '../database/schema.js';
import { AiService } from '../ai/ai.service.js';
import { ConfigService } from '@nestjs/config';
import { and, desc, eq } from 'drizzle-orm';
import { PROPOSAL_SYSTEM_PROMPT } from '../ai/prompts/proposal.prompt.js';
import { proposalSchema } from '../ai/schemas/proposal.schema.js';

@Injectable()
export class ProposalsService {
    constructor(
        @Inject(DRIZZLE_DB)
        private readonly db: NodePgDatabase<typeof schema>,

        private readonly aiService: AiService,

        private readonly configSrevice: ConfigService,
    ) {}


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
        throw new NotFoundException('No analysis found. Analyze the project brief first');
    }

    const [brief] = await this.db
    .select()
    .from(briefs)
    .where(eq(briefs.id, analysis.briefId))
    .limit(1);

    if (!brief) {
        throw new NotFoundException('Brief not found');
    }

    const [plan] = await this.db
        .select()
        .from(projectPlans)
        .where(
            and(
                eq(projectPlans.projectId, projectId),
                eq(projectPlans.analysesId, analysis.id),
            ),
        )
        .orderBy(desc(projectPlans.createdAt))
        .limit(1);

    if (!plan) {
        throw new NotFoundException(' Project plan not found. Generate the project plan first.');
    }

    const userPrompt = `
    Project title:
    ${project.title}
    
    Original project brief:
    ${brief.content}
    
    AI analysis:
    ${JSON.stringify({
        summary: analysis.summary,
        requirements: analysis.requirements,
        questions: analysis.questions,
    })}
    
    Project plan:
    ${JSON.stringify({
        title: plan.title,
        overview: plan.overview,
        phases: plan.phases,
        deliverables: plan.deliverables,
        assumptions: plan.assumptions,
        risks: plan.risks,
    })}
    
    Create a professional project proposal for the client.
    `;

    const rawResponse = await this.aiService.generateJson(
        PROPOSAL_SYSTEM_PROMPT,
        userPrompt,
    );

    let parsedResponse: unknown;

    try {
        parsedResponse = JSON.parse(rawResponse);
    } catch {
        throw new ServiceUnavailableException('AI returned invalid JSON');
    }


    const validation = proposalSchema.safeParse(parsedResponse);
    if (!validation.success) {
        throw new ServiceUnavailableException(
            'AI returned an invalid proposal structure',
        );
    }

    const result = validation.data;

    const [savedProposal] = await this.db
        .insert(proposals)
        .values({
          projectId,
          analysesId: analysis.id,
          title: result.title,
          introduction: result.introduction,
          projectUnderstanding: result.projectUnderstanding,
          scopeIn: result.scopeIn,
          scopeOut: result.scopeOut,
          deliverables: result.deliverables,
          timeline: result.timeline,
          assumptions: result.assumptions,
          model: this.configSrevice.getOrThrow<string>('GROQ_MODEL'),
      })
      .returning();
      return savedProposal
    }

    async findAll(userId: string, projectId: string) {
    // Check ownership
    const [project] = await this.db
      .select({ id: projects.id })
      .from(projects)
      .where(
        and(
          eq(projects.id, projectId),
          eq(projects.userId, userId),
        ),
      )
      .limit(1);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.db
      .select()
      .from(proposals)
      .where(eq(proposals.projectId, projectId))
      .orderBy(desc(proposals.createdAt));
  }
}

