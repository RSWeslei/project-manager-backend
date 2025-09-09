import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implementar tela de login' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    required: false,
    example: 'Criar a interface e a lógica de autenticação.',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    enum: ['todo', 'in_progress', 'review', 'done'],
    example: 'todo',
  })
  @IsEnum(['todo', 'in_progress', 'review', 'done'])
  @IsNotEmpty()
  status: 'todo' | 'in_progress' | 'review' | 'done';

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'], example: 'high' })
  @IsEnum(['low', 'medium', 'high', 'critical'])
  @IsNotEmpty()
  priority: 'low' | 'medium' | 'high' | 'critical';

  @ApiProperty({ required: false, example: '2025-10-15' })
  @IsDateString()
  @IsOptional()
  dueDate: Date;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  projectId: number;
}
