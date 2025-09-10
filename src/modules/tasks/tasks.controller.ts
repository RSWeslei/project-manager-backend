import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Tarefas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Criar tarefa' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tarefas' })
  findAll(
    @Query('projectId') projectId?: number,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('q') q?: string,
  ) {
    return this.tasksService.findAll({ projectId, status, priority, q });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter tarefa por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir tarefa' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
