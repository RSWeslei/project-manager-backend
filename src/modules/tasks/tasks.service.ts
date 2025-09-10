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
    const assigneeId = this.authUser.getUserId();

    const taskData = {
      ...createTaskDto,
      assigneeId,
    };

    const newTask = new this.taskModel(taskData);
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
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    await task.update(updateTaskDto);
    return task.reload();
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await task.destroy();
  }
}
