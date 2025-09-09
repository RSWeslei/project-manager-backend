import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import { Project } from '@/modules/projects/entities/project.entity';
import { User } from '@/modules/users/entities/user.entity';

@Table({ tableName: 'project_members', timestamps: true, paranoid: true })
export class ProjectMember extends Model<
  InferAttributes<ProjectMember>,
  InferCreationAttributes<ProjectMember>
> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: CreationOptional<number>;

  @ForeignKey(() => Project)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare projectId: number;

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @BelongsTo(() => User)
  declare user?: NonAttribute<User>;

  @Column({ type: DataType.STRING, allowNull: false })
  declare role: 'viewer' | 'contributor' | 'maintainer';
}
