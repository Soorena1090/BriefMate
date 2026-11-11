import { Inject, Injectable } from '@nestjs/common';
import { AI_PROVIDER } from './ai.constants.js';
import type { AIProvider } from './interfaces/ai-provider.interface.js';

@Injectable()
export class AiService {
    constructor(
        @Inject(AI_PROVIDER)
        private readonly aiProvider: AIProvider,
    ) {}

    async generateText(
        systemPrompt: string,
        userPrompt: string,
    ): Promise<string> {
        return this.aiProvider.generateText(
            systemPrompt,
            userPrompt,
        );
    }
}
