import { Module } from '@nestjs/common';
import { AnalysesService } from './analyses.service.js';
import { AnalysesController } from './analyses.controller.js';
import { DatabaseModule } from '../database/database.module.js';
import { AiModule } from '../ai/ai.module.js';

@Module({
  imports: [
    DatabaseModule,
    AiModule,
  ],
  providers: [AnalysesService],
  controllers: [AnalysesController],
  exports: [AnalysesService],
})
export class AnalysesModule {}
