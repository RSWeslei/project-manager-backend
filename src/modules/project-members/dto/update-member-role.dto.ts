import { IsInt, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateMemberRoleDto {
  @IsInt()
  projectId!: number;

  @IsInt()
  userId!: number;

  @IsNotEmpty()
  @IsIn(['viewer', 'contributor', 'maintainer'])
  role!: 'viewer' | 'contributor' | 'maintainer';
}
