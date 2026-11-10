import { Module } from '@nestjs/common';
import { BriefsService } from './briefs.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { BriefsController } from './briefs.controller.js';

@Module({
  imports: [DatabaseModule],
  providers: [BriefsService],
  controllers: [BriefsController],
  exports: [BriefsService],
})
export class BriefsModule {}
