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

@ApiTags('membros-do-projeto')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('project-members')
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar um usuário a um projeto' })
  addMember(@Body() addMemberDto: AddMemberDto) {
    return this.projectMembersService.addMember(addMemberDto);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Listar todos os membros de um projeto' })
  findMembersByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectMembersService.findMembersByProject(projectId);
  }

  @Delete()
  @ApiOperation({ summary: 'Remover um usuário de um projeto' })
  removeMember(
    @Query('projectId', ParseIntPipe) projectId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.projectMembersService.removeMember(projectId, userId);
  }
}
