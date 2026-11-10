import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ProjectsService } from './projects.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        email: string;
    };
}

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(
        private readonly projectService: ProjectsService,
    ) { }

    @Post()
    create(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreateProjectDto,
    ) {
        return this.projectService.create(req.user.userId, dto);
    }

    @Get()
    findAll(@Req() req: AuthenticatedRequest) {
        return this.projectService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(
        @Req() req: AuthenticatedRequest,
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.projectService.findOne(req.user.userId, id);
    }

    @Patch(':id')
    update(
        @Req() req: AuthenticatedRequest,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateProjectDto,
    ) {
        return this.projectService.update(
            req.user.userId,
            id,
            dto,
        );
    }


    @Delete(':id')
    remove(
        @Req() req: AuthenticatedRequest,
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.projectService.remove(req.user.userId, id);
    }
}
