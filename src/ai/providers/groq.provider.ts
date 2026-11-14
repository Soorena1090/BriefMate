import { Injectable, ServiceUnavailableException, RequestTimeoutException } from "@nestjs/common";
import { AIProvider } from "../interfaces/ai-provider.interface.js";
import OpenAI from "openai";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GroqProvider implements AIProvider {
    private readonly client: OpenAI;
    private readonly model: string;

    constructor(
        private readonly configService: ConfigService,
    ) {
        const apiKey = this.configService.getOrThrow<string>(
            'GROQ_API_KEY',
        );

        this.model = this.configService.getOrThrow<string>(
            'GROQ_MODEL',
        );

        this.client = new OpenAI({
            apiKey,
            baseURL: 'https://api.groq.com/openai/v1',
        });
    }

    async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt,
                    },
                    {
                        role: 'user',
                        content: userPrompt,
                    },
                ],
            });

            const content = response.choices[0]?.message?.content;

            if (!content) {
                throw new ServiceUnavailableException(
                    'AI provider returned an empty response',
                );
            }

            return content;
        } catch (error) {
            if (error instanceof ServiceUnavailableException) {
                throw error;
            }

            const status =
                typeof error === 'object' &&
                    error !== null &&
                    'status' in error
                    ? error.status
                    : undefined;

            if (status === 429) {
                throw new RequestTimeoutException(
                    'AI provider rate limit exceeded. Try again later.',
                );
            }

            throw new ServiceUnavailableException(
                'AI provider request failed',
            );
        }
    }

    async generateJson(
        systemPrompt: string,
        userPrompt: string,
    ): Promise<string> {
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,

                messages: [
                    {
                        role: 'system',
                        content: systemPrompt,
                    },
                    {
                        role: 'user',
                        content: userPrompt,
                    },
                ],
                response_format: {
                    type: 'json_schema',
                    json_schema: {
                        name: 'brief_analysis',
                        strict: true,
                        schema: {
                            type: 'object',
                            properties: {
                                summary: {
                                    type: 'string',
                                },
                                requirements: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            title: { type: 'string' },
                                            description: { type: 'string' },
                                            type: {
                                                type: 'string',
                                                enum: ['functional', 'non_functional'],
                                            },
                                            priority: {
                                                type: 'string',
                                                enum: ['high', 'medium', 'low'],
                                            },
                                        },
                                        required: ['title', 'description', 'type', 'priority'],
                                        additionalProperties: false,
                                    },
                                },
                                questions: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            question: { type: 'string' },
                                            reason: { type: 'string' },
                                            importance: {
                                                type: 'string',
                                                enum: ['high', 'medium', 'low'],
                                            },
                                        },
                                        required: ['question', 'reason', 'importance'],
                                        additionalProperties: false,
                                    },
                                },
                            },
                            required: ['summary', 'requirements', 'questions'],
                            additionalProperties: false,
                        },
                    },
                },
                temperature: 0.2,
            });

            const content = response.choices[0]?.message?.content;

            if (!content) {
                throw new ServiceUnavailableException(
                    'AI provider returned an empty response',
                );
            }
            return content;
        } catch (error) {
            if (error instanceof ServiceUnavailableException) {
                throw error;
            }

            const status = typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined;

            if (status === 429) {
                throw new RequestTimeoutException(
                    'AI provider rate limit exceeded',
                );
            }

            throw new ServiceUnavailableException(
                'AI provider request failed',
            );
        }
    }
}