import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('project-members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('project-members')
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Add a user to a project' })
  addMember(@Body() addMemberDto: AddMemberDto) {
    return this.projectMembersService.addMember(addMemberDto);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'List all members of a project' })
  findMembersByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectMembersService.findMembersByProject(projectId);
  }

  @Delete()
  @ApiOperation({ summary: 'Remove a user from a project' })
  removeMember(
    @Query('projectId', ParseIntPipe) projectId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.projectMembersService.removeMember(projectId, userId);
  }
}
