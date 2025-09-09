import { Module } from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { ProjectMembersController } from './project-members.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectMember } from './entities/project-member.entity';

@Module({
  imports: [SequelizeModule.forFeature([ProjectMember])],
  controllers: [ProjectMembersController],
  providers: [ProjectMembersService],
})
export class ProjectMembersModule {}
