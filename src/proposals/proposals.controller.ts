import { Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ProposalsService } from './proposals.service.js';

interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        email: string;
    };
}


@Controller('projects/:projectId/proposals')
@UseGuards(JwtAuthGuard)
export class ProposalsController {
    constructor(
        private readonly proposalsService: ProposalsService,
    ) {}

    @Post()
    generate(
        @Req() req: AuthenticatedRequest,
        @Param('projectId', ParseUUIDPipe) projectId: string,
    ) {
        return this.proposalsService.generate(
            req.user.userId,
            projectId,
        );
    }

    @Get()
    findAll(
        @Req() req: AuthenticatedRequest,
        @Param('projectId', ParseUUIDPipe) projectId: string,
    ) {
        return this.proposalsService.findAll(
            req.user.userId,
            projectId
        )
    }
}
