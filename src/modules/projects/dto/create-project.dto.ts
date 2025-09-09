import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Desenvolvimento do Novo App' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Aplicativo de gestão de finanças pessoais' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    enum: ['planned', 'active', 'completed', 'cancelled'],
    example: 'planned',
  })
  @IsEnum(['planned', 'active', 'completed', 'cancelled'])
  @IsNotEmpty()
  status: 'planned' | 'active' | 'completed' | 'cancelled';

  @ApiProperty({ example: '2025-10-01' })
  @IsDateString()
  @IsOptional()
  startDate: Date;

  @ApiProperty({ example: '2026-04-01' })
  @IsDateString()
  @IsOptional()
  endDate: Date;
}
