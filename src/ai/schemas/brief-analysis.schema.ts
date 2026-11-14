import { z } from "zod";

export const briefAnalysisSchema = z.object({
    summary: z.string().min(1),
    requirements: z.array(
        z.object({
            title: z.string().min(1),
            description: z.string().min(1),
            type: z.enum([
                "functional",
                "non_functional",
            ]),

            priority: z.enum([
                'high',
                'medium',
                'low',
            ]),
        }),
    ),
    questions: z.array(
        z.object({
            question: z.string().min(1),
            reason: z.string().min(1),
            importance: z.enum([
                'high',
                'medium',
                'low',
            ]),
        }),
    ),
});

export type BriefAnalysis = z.infer<typeof briefAnalysisSchema>;