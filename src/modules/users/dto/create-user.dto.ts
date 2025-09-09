import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Endereço de e-mail único do usuário',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo de 8 caracteres)',
    example: 'strongPassword123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Nível de acesso do usuário',
    enum: ['admin', 'manager', 'developer'],
    example: 'developer',
  })
  @IsNotEmpty()
  @IsIn(['admin', 'manager', 'developer'])
  role: 'admin' | 'manager' | 'developer';
}
