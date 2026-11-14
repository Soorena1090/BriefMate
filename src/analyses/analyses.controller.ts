import { Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AnalysesService } from './analyses.service.js';

interface AuthenticateRequest extends Request {
    user: {
        userId: string;
        email: string;
    };
}

@Controller('projects/:projectId/analyses')
@UseGuards(JwtAuthGuard)
export class AnalysesController {
    constructor(
        private readonly analysesService: AnalysesService,
    ) {}

    @Post()
    analyze(
        @Req() req: AuthenticateRequest,
        @Param('projectId', ParseUUIDPipe) projectId: string,
    ) {
        return this.analysesService.analyzeBrief(
            req.user.userId,
            projectId,
        );
    }

    @Get()
    findAll(
        @Req() req: AuthenticateRequest,
        @Param('projectId', ParseUUIDPipe) projectId: string,
    ) {
        return this.analysesService.findAll(
            req.user.userId,
            projectId,
        );
    }
}
