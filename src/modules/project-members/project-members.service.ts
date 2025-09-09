import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectMember } from './entities/project-member.entity';
import { AddMemberDto } from './dto/add-member.dto';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class ProjectMembersService {
  constructor(
    @InjectModel(ProjectMember)
    private projectMemberModel: typeof ProjectMember,
  ) {}

  async addMember(addMemberDto: AddMemberDto): Promise<ProjectMember> {
    const existing = await this.projectMemberModel.findOne({
      where: {
        projectId: addMemberDto.projectId,
        userId: addMemberDto.userId,
      },
    });

    if (existing) {
      throw new ConflictException('User is already a member of this project.');
    }

    return this.projectMemberModel.create(addMemberDto);
  }

  async findMembersByProject(projectId: number): Promise<ProjectMember[]> {
    return this.projectMemberModel.findAll({
      where: { projectId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });
  }

  async removeMember(projectId: number, userId: number): Promise<void> {
    const member = await this.projectMemberModel.findOne({
      where: { projectId, userId },
    });

    if (!member) {
      throw new NotFoundException('Project member not found.');
    }

    await member.destroy();
  }
}
