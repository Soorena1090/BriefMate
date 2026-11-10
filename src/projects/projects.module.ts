import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { ProjectsController } from './projects.controller.js';
@Module({
  imports: [DatabaseModule],

  providers: [ProjectsService],

  controllers: [ProjectsController],

  exports: [ProjectsService]
})
export class ProjectsModule {}
