import { Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ProjectPlansService } from './project-plans.service.js';


interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        email: string;
    };
}

@Controller('projects/:projectId/plan')
@UseGuards(JwtAuthGuard)
export class ProjectPlansController {
    constructor(
        private readonly projectPlansService: ProjectPlansService,
    ) {}

    @Post()
    generate(
        @Req() req: AuthenticatedRequest,
        @Param('projectId', ParseUUIDPipe) projectId: string,
    ) {
        return this.projectPlansService.generate(
            req.user.userId,
            projectId,
        );
    }


    @Get()
    findAll(
        @Req() req: AuthenticatedRequest,
        @Param('projectId', ParseUUIDPipe) projectId: string,
    ) {
        return this.projectPlansService.findAll(
            req.user.userId,
            projectId,
        );
    }
}
