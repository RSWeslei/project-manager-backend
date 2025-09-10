import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get dashboard statistics for all or a specific project',
  })
  @ApiQuery({ name: 'projectId', required: false, type: Number })
  getDashboardStats(
    @Query('projectId', new ParseIntPipe({ optional: true }))
    projectId?: number,
  ) {
    return this.projectsService.getDashboardStats(projectId);
  }

  @Get()
  @ApiOperation({ summary: 'List all projects with optional filters' })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'q', required: false, type: String })
  findAll(@Query('status') status?: string, @Query('q') q?: string) {
    return this.projectsService.findAll(status, q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single project by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Delete a project (Admin/Manager only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }
}
