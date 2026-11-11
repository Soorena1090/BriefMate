import { Module } from '@nestjs/common';
import { AiService } from './ai.service.js';
import { AiController } from './ai.controller.js';
import { AI_PROVIDER } from './ai.constants.js';
import { GroqProvider } from './providers/groq.provider.js';

@Module({
  providers: [
    AiService,
    {
      provide: AI_PROVIDER,
      useClass: GroqProvider,
    },
  ],
  exports: [AiService],
  controllers: [AiController]
})
export class AiModule {}
