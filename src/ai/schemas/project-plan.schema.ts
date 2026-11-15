import { z } from "zod";

export const projectPlanSchema = z.object({
    title: z.string().min(1),

    overview: z.string().min(1),

    phases: z.array(
        z.object({
            title: z.string().min(1),
            description: z.string().min(1),

            tasks: z.array(z.string().min(1)),

            estimatedDuration: z.string().min(1),
        }),
    ),

    deliverables: z.array(
        z.object({
            title: z.string().min(1),
            description: z.string().min(1),
        }),
    ),

    assumptions: z.array(z.string()),

    risks: z.array(
        z.object({
            title: z.string().min(1),
            impact: z.enum(['high', 'medium', 'low']),
            mitigation: z.string().min(1),
        }),
    ),
});

export type ProjectPlan = z.infer<typeof projectPlanSchema>;
