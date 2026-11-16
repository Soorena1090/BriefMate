import { proposalSchema } from "./proposal.schema.js";

describe('ProposalSchema', () => {
  const validData = {
    title: 'E-commerce Project Proposal',
    introduction: 'We propose developing an e-commerce platform.',
    projectUnderstanding: 'The client needs an online store.',
    scopeIn: ['User authentication', 'Product management'],
    scopeOut: ['Mobile application'],
    deliverables: [
      {
        title: 'Backend API',
        description: 'REST API for the platform',
      },
    ],
    timeline: [
      {
        phase: 'Backend Development',
        description: 'Develop backend functionality',
        estimatedDuration: '2 weeks',
      },
    ],
    assumptions: [],
  };

  it('should accept valid proposal', () => {
    expect(proposalSchema.safeParse(validData).success).toBe(true);
  });

  it('should reject empty introduction', () => {
    expect(
      proposalSchema.safeParse({
        ...validData,
        introduction: '',
      }).success,
    ).toBe(false);
  });

  it('should reject missing timeline', () => {
    const { timeline, ...invalidData } = validData;

    expect(proposalSchema.safeParse(invalidData).success).toBe(false);
  });
});