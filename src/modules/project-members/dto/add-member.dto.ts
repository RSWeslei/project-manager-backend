import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export class AddMemberDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    enum: ['viewer', 'contributor', 'maintainer'],
    example: 'contributor',
  })
  @IsEnum(['viewer', 'contributor', 'maintainer'])
  @IsNotEmpty()
  role: 'viewer' | 'contributor' | 'maintainer';
}
