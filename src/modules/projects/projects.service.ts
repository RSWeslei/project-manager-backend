import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthUserService } from '@/modules/auth/auth-user.service';
import { Task } from '@/modules/tasks/entities/task.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Op, Sequelize, WhereOptions } from 'sequelize';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private projectModel: typeof Project,
    @InjectModel(Task) private taskModel: typeof Task,
    private readonly authUser: AuthUserService,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const managerId = this.authUser.getUserId();
    return this.projectModel.create({
      ...createProjectDto,
      managerId,
    });
  }

  findAll(status?: string, q?: string): Promise<Project[]> {
    const where: WhereOptions<Project> = {};

    if (status) {
      where.status = status;
    }

    if (q) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
      ];
    }

    return this.projectModel.findAll({ where, include: ['manager'] });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectModel.findByPk(id, {
      include: ['manager'],
    });
    if (!project) {
      throw new NotFoundException(`Projeto com ID ${id} não encontrado.`);
    }
    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id);
    await project.update(updateProjectDto);
    return project.reload();
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await project.destroy();
  }

  async getDashboardStats(projectId?: number) {
    const whereClause = projectId ? { projectId } : {};

    const kpis = {
      totalTasks: await this.taskModel.count({ where: whereClause }),
      completedTasks: await this.taskModel.count({
        where: { ...whereClause, status: 'done' },
      }),
      pendingTasks: await this.taskModel.count({
        where: { ...whereClause, status: { [Op.ne]: 'done' } },
      }),
      overdueTasks: await this.taskModel.count({
        where: {
          ...whereClause,
          status: { [Op.ne]: 'done' },
          dueDate: { [Op.lt]: new Date() },
        },
      }),
    };

    const tasksPerUserResult = await this.taskModel.findAll({
      where: whereClause,
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('Task.id')), 'count']],
      include: [{ model: User, as: 'assignee', attributes: ['name'] }],
      group: ['assignee.id', 'assignee.name'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('Task.id')), 'DESC']],
      limit: 7,
      raw: true,
    });

    const tasksPerUser = tasksPerUserResult.map((item: any) => ({
      user: item['assignee.name'] || 'Não atribuído',
      tasks: parseInt(item.count, 10),
    }));

    const tasksByStatus = await this.taskModel.findAll({
      where: whereClause,
      attributes: ['status', [Sequelize.fn('COUNT', 'status'), 'count']],
      group: ['status'],
      raw: true,
    });

    return {
      kpis,
      tasksPerUser,
      tasksByStatus,
    };
  }
}
