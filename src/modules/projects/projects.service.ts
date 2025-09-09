import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthUserService } from '@/modules/auth/auth-user.service';
import { Task } from '@/modules/tasks/entities/task.entity';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private projectModel: typeof Project,
    @InjectModel(Task) private taskModel: typeof Task,
    @InjectModel(User) private userModel: typeof User,
    private readonly authUser: AuthUserService,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const managerId = this.authUser.getUserId();
    return this.projectModel.create({
      ...createProjectDto,
      managerId,
    });
  }

  findAll(): Promise<Project[]> {
    return this.projectModel.findAll({ include: ['manager'] });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectModel.findByPk(id, {
      include: ['manager'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
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

  async getDashboardStats(projectId: number) {
    const totalTasks = await this.taskModel.count({
      where: { projectId },
    });

    const tasksByStatus = await this.taskModel.findAll({
      where: { projectId },
      attributes: [
        'status',
        [this.taskModel.sequelize!.fn('COUNT', 'status'), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    const tasksPerUser = await this.taskModel.findAll({
      where: { projectId },
      attributes: [
        'assigneeId',
        [this.taskModel.sequelize!.fn('COUNT', 'assigneeId'), 'count'],
      ],
      include: [
        {
          model: this.userModel,
          attributes: ['name'],
        },
      ],
      group: ['assigneeId', 'assignee.id'],
    });

    return {
      totalTasks,
      tasksByStatus,
      tasksPerUser,
    };
  }
}
