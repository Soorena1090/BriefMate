import { Module } from '@nestjs/common';
import { ProposalsService } from './proposals.service.js';
import { ProposalsController } from './proposals.controller.js';
import { DatabaseModule } from '../database/database.module.js';
import { AiModule } from '../ai/ai.module.js';

@Module({
  imports: [DatabaseModule, AiModule],
  providers: [ProposalsService],
  controllers: [ProposalsController],
  exports: [ProposalsService],
})
export class ProposalsModule {}
