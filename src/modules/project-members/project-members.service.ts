import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { AuthUserService } from '../auth/auth-user.service';
import { ProjectMember } from '@/modules/project-members/entities/project-member.entity';
import { AddMemberDto } from '@/modules/project-members/dto/add-member.dto';
import { UpdateMemberRoleDto } from '@/modules/project-members/dto/update-member-role.dto';

type MemberRole = 'viewer' | 'contributor' | 'maintainer';
type GlobalRole = 'admin' | 'manager' | 'developer';

@Injectable()
export class ProjectMembersService {
  constructor(
    @InjectModel(ProjectMember)
    private readonly memberModel: typeof ProjectMember,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
    private readonly authUser: AuthUserService,
  ) {}

  private async assertCanManageMembers(projectId: number): Promise<{
    currentUserId: number;
    currentUserRole: GlobalRole;
  }> {
    const currentUserId = this.authUser.getUserId();
    const currentUserRole = this.authUser.getUserRole() as GlobalRole;

    if (!currentUserId) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    if (currentUserRole === 'admin' || currentUserRole === 'manager') {
      return { currentUserId, currentUserRole };
    }

    // Verifica se é maintainer do projeto
    const maintainer = await this.memberModel.findOne({
      where: { projectId, userId: currentUserId, role: 'maintainer' },
    });
    if (!maintainer) {
      throw new ForbiddenException(
        'Sem permissão para gerenciar membros deste projeto',
      );
    }

    return { currentUserId, currentUserRole };
  }

  private async ensureProjectExists(projectId: number) {
    const project = await this.projectsService.findOne(projectId);
    if (!project) throw new NotFoundException('Projeto não encontrado');
    return project;
  }

  private async ensureUserExists(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  private async countMaintainers(projectId: number): Promise<number> {
    return this.memberModel.count({ where: { projectId, role: 'maintainer' } });
  }

  async findMembersByProject(projectId: number) {
    await this.ensureProjectExists(projectId);
    // mantém seu include/attributes originais, assumindo que já estavam ok
    return this.memberModel.findAll({
      where: { projectId },
      include: [{ association: 'user' }], // respeita seu relacionamento atual
      order: [['role', 'ASC']],
    });
  }

  async addMember(dto: AddMemberDto) {
    const { projectId, userId, role } = dto;

    const project = await this.ensureProjectExists(projectId);
    await this.ensureUserExists(userId);
    await this.assertCanManageMembers(projectId);

    const exists = await this.memberModel.findOne({
      where: { projectId, userId },
    });
    if (exists) {
      throw new BadRequestException('Usuário já é membro do projeto');
    }

    if (project.managerId === userId && role !== 'maintainer') {
      throw new UnprocessableEntityException(
        'O gerente do projeto deve ser um maintainer',
      );
    }

    const created = await this.memberModel.create({ projectId, userId, role });
    return created;
  }

  async updateMemberRole(dto: UpdateMemberRoleDto) {
    const { projectId, userId, role } = dto;

    const project = await this.ensureProjectExists(projectId);
    await this.ensureUserExists(userId);
    await this.assertCanManageMembers(projectId);

    const membership = await this.memberModel.findOne({
      where: { projectId, userId },
    });
    if (!membership) {
      throw new NotFoundException('Membro não encontrado neste projeto');
    }

    const isManagerUser = project.managerId === userId;

    if (isManagerUser && role !== 'maintainer') {
      throw new UnprocessableEntityException(
        'Para rebaixar o gerente do projeto, troque o gerente primeiro',
      );
    }

    const wasMaintainer = membership.role === 'maintainer';
    const willBeMaintainer = role === 'maintainer';

    if (wasMaintainer && !willBeMaintainer) {
      const maintainers = await this.countMaintainers(projectId);
      if (maintainers <= 1) {
        throw new UnprocessableEntityException(
          'Não é permitido remover o último maintainer',
        );
      }
    }

    membership.role = role as MemberRole;
    await membership.save();
    return membership;
  }

  async removeMember(projectId: number, userId: number) {
    const project = await this.ensureProjectExists(projectId);
    await this.assertCanManageMembers(projectId);

    const membership = await this.memberModel.findOne({
      where: { projectId, userId },
    });
    if (!membership) {
      throw new NotFoundException('Membro não encontrado neste projeto');
    }

    if (project.managerId === userId) {
      throw new UnprocessableEntityException(
        'Troque o gerente do projeto antes de remover este membro',
      );
    }

    if (membership.role === 'maintainer') {
      const maintainers = await this.countMaintainers(projectId);
      if (maintainers <= 1) {
        throw new UnprocessableEntityException(
          'Não é permitido remover o último maintainer',
        );
      }
    }

    await membership.destroy();
    return { success: true };
  }
}
