import { projectPlanSchema } from "./project-plan.schema.js";

describe('ProjectPlanSchema', () => {
  const validData = {
    title: 'E-commerce Development Plan',
    overview: 'Development of an e-commerce platform',
    phases: [
      {
        title: 'Backend Development',
        description: 'Develop backend APIs',
        tasks: ['Authentication', 'Product APIs'],
        estimatedDuration: '2 weeks',
      },
    ],
    deliverables: [
      {
        title: 'Backend API',
        description: 'A working REST API',
      },
    ],
    assumptions: [],
    risks: [
      {
        title: 'Payment integration delay',
        impact: 'medium',
        mitigation: 'Confirm payment provider early',
      },
    ],
  };

  it('should accept valid project plan', () => {
    expect(projectPlanSchema.safeParse(validData).success).toBe(true);
  });

  it('should reject invalid risk impact', () => {
    const invalidData = {
      ...validData,
      risks: [
        {
          ...validData.risks[0],
          impact: 'critical',
        },
      ],
    };

    expect(projectPlanSchema.safeParse(invalidData).success).toBe(false);
  });

  it('should reject empty title', () => {
    expect(
      projectPlanSchema.safeParse({
        ...validData,
        title: '',
      }).success,
    ).toBe(false);
  });
});