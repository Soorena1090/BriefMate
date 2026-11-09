import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { BriefsModule } from './briefs/briefs.module.js';
import { AnalysesModule } from './analyses/analyses.module.js';
import { ProposalsModule } from './proposals/proposals.module.js';
import { AiModule } from './ai/ai.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
   ConfigModule.forRoot({
    isGlobal: true,
   }),
   DatabaseModule,
   UsersModule,
   AuthModule,
   ProjectsModule,
   BriefsModule,
   AnalysesModule,
   ProposalsModule,
   AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
