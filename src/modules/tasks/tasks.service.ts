import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { AuthUserService } from '@/modules/auth/auth-user.service';
import { Project } from '@/modules/projects/entities/project.entity';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task) private taskModel: typeof Task,
    private readonly authUser: AuthUserService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const project = await Project.findByPk(createTaskDto.projectId);
    if (!project) throw new NotFoundException('Projeto não encontrado');

    const chosenAssigneeId =
      createTaskDto.assigneeId ?? this.authUser.getUserId();

    const assignee = await User.findByPk(chosenAssigneeId);
    if (!assignee)
      throw new NotFoundException('Usuário (assignee) não encontrado');

    const newTask = new this.taskModel({
      ...createTaskDto,
      assigneeId: chosenAssigneeId,
      description: createTaskDto.description ?? '',
    });

    await newTask.save();
    return newTask;
  }

  findAll(filters: {
    projectId?: number;
    status?: string;
    priority?: string;
    q?: string;
  }): Promise<Task[]> {
    const where: WhereOptions<Task> = {};

    if (filters.projectId) {
      where.projectId = filters.projectId;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.priority) {
      where.priority = filters.priority;
    }
    if (filters.q) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${filters.q}%` } },
        { description: { [Op.iLike]: `%${filters.q}%` } },
      ];
    }

    const options: FindOptions = {
      where,
      include: [
        { model: Project, attributes: ['name'] },
        { model: User, as: 'assignee', attributes: ['name'] },
      ],
      order: [['createdAt', 'DESC']],
    };

    return this.taskModel.findAll(options);
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskModel.findByPk(id);
    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (updateTaskDto.projectId !== undefined) {
      const project = await Project.findByPk(updateTaskDto.projectId);
      if (!project) throw new NotFoundException('Projeto não encontrado');
    }

    if (updateTaskDto.assigneeId !== undefined) {
      const assignee = await User.findByPk(updateTaskDto.assigneeId);
      if (!assignee)
        throw new NotFoundException('Usuário (assignee) não encontrado');
    }

    await task.update(updateTaskDto);
    return task.reload();
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await task.destroy();
  }
}
