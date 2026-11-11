import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AiService } from './ai.service.js';
import { GenerateTextDto } from './dto/generate-text.dto.js';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
    constructor(
        private readonly aiService: AiService,
    ) {}

    @Post('test')
    async testAI(@Body() dto: GenerateTextDto) {
        const systemPrompt = `
            You are an AI assistant for a software project management platform.
            Provide clear, accurate, and structured answers.
            Do not invent facts that are not present in the user's input.
        `;

        const response = await this.aiService.generateText(
            systemPrompt,
            dto.prompt,
        );

        return {
            success: true,
            modelResponse: response,
        }
    }
}
