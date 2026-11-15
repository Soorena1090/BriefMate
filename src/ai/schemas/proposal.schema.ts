import { z } from 'zod';

export const proposalSchema = z.object({
  title: z.string().min(1),

  introduction: z.string().min(1),

  projectUnderstanding: z.string().min(1),

  scopeIn: z.array(z.string().min(1)),

  scopeOut: z.array(z.string().min(1)),

  deliverables: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    }),
  ),

  timeline: z.array(
    z.object({
      phase: z.string().min(1),
      description: z.string().min(1),
      estimatedDuration: z.string().min(1),
    }),
  ),

  assumptions: z.array(z.string()),
});

export type Proposal = z.infer<typeof proposalSchema>;