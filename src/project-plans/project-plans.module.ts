import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { AiModule } from '../ai/ai.module.js';
import { ProjectPlansController } from './project-plans.controller.js';
import { ProjectPlansService } from './project-plans.service.js';

@Module({
    imports: [DatabaseModule, AiModule],
    controllers: [ProjectPlansController],
    providers: [ProjectPlansService],
    exports: [ProjectPlansService]
})
export class ProjectPlansModule {}
