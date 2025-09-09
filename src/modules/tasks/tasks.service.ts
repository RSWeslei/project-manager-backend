import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindOptions } from 'sequelize';
import { AuthUserService } from '@/modules/auth/auth-user.service';

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

  findAll(projectId?: number): Promise<Task[]> {
    const options: FindOptions = {};
    if (projectId) {
      options.where = { projectId };
    }
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
