import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { BriefsService } from './briefs.service.js';
import { CreateBriefDto } from './dto/create-brief.dto.js';
import { UpdateBriefDto } from './dto/update-brief.dto.js';


interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        email: string;
    };
}

@Controller('projects/:projectId/brief')
@UseGuards(JwtAuthGuard)
export class BriefsController {
    constructor(
        private readonly briefsService: BriefsService,
    ) {}

    @Post()
    create(
        @Req() req: AuthenticatedRequest,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body() dto: CreateBriefDto,
    ) {
        return this.briefsService.create(req.user.userId, projectId, dto,);
    }

    @Get()
    findOne(
        @Req() req: AuthenticatedRequest,
        @Param('projectId', ParseUUIDPipe) projectId: string,
    ) {
        return this.briefsService.findOne(req.user.userId, projectId);
    }

    @Patch()
    update(
        @Req() req: AuthenticatedRequest,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body() dto: UpdateBriefDto,
    ) {
        return this.briefsService.update(
            req.user.userId,
            projectId,
            dto,
        );
    }


    @Delete()
    remove(
        @Req() req: AuthenticatedRequest,
        @Param('projectId', ParseUUIDPipe) projectId: string,
    ) {
        return this.briefsService.remove(req.user.userId, projectId);
    }
}
