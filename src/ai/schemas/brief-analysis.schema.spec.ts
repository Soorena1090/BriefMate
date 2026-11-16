import { briefAnalysisSchema } from "./brief-analysis.schema.js";

describe('BriefAnalysisSchema', () => {
  const validData = {
    summary: 'An e-commerce application',
    requirements: [
      {
        title: 'User Authentication',
        description: 'Users can register and log in',
        type: 'functional',
        priority: 'high',
      },
    ],
    questions: [
      {
        question: 'Which payment gateway should be used?',
        reason: 'The payment provider is not specified',
        importance: 'high',
      },
    ],
  };

  it('should accept valid analysis data', () => {
    const result = briefAnalysisSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it('should reject invalid requirement type', () => {
    const result = briefAnalysisSchema.safeParse({
      ...validData,
      requirements: [
        {
          ...validData.requirements[0],
          type: 'unknown',
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it('should reject empty summary', () => {
    const result = briefAnalysisSchema.safeParse({
      ...validData,
      summary: '',
    });

    expect(result.success).toBe(false);
  });

  it('should reject missing questions', () => {
    const { questions, ...invalidData } = validData;

    const result = briefAnalysisSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });
});