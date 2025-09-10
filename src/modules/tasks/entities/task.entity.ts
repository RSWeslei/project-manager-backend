import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import { Project } from '@/modules/projects/entities/project.entity';
import { User } from '@/modules/users/entities/user.entity';

@Table({ tableName: 'tasks', timestamps: true, paranoid: true })
export class Task extends Model<
  InferAttributes<Task>,
  InferCreationAttributes<Task>
> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column(DataType.TEXT)
  declare description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare status: 'todo' | 'in_progress' | 'review' | 'done';

  @Column({ type: DataType.STRING, allowNull: false })
  declare priority: 'low' | 'medium' | 'high' | 'critical';

  @AllowNull(true)
  @Column({ type: DataType.DATE })
  declare dueDate: Date | null;

  @ForeignKey(() => Project)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare projectId: number;

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare assigneeId: number;

  @BelongsTo(() => User, 'assigneeId')
  declare assignee?: NonAttribute<User>;
}
