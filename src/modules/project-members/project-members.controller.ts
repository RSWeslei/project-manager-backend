import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AddMemberDto } from '@/modules/project-members/dto/add-member.dto';
import { UpdateMemberRoleDto } from '@/modules/project-members/dto/update-member-role.dto';

@UseGuards(JwtAuthGuard)
@Controller('project-members')
export class ProjectMembersController {
  constructor(private readonly service: ProjectMembersService) {}

  @Get('project')
  async byProject(@Query('projectId') projectId: string) {
    return this.service.findMembersByProject(Number(projectId));
  }

  @Post()
  async add(@Body() dto: AddMemberDto) {
    return this.service.addMember(dto);
  }

  @Patch('role')
  async updateRole(@Body() dto: UpdateMemberRoleDto) {
    return this.service.updateMemberRole(dto);
  }

  @Delete()
  async remove(
    @Query('projectId') projectId: string,
    @Query('userId') userId: string,
  ) {
    return this.service.removeMember(Number(projectId), Number(userId));
  }
}
