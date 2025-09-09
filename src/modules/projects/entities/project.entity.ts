import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import { User } from '@/modules/users/entities/user.entity';
import { Task } from '@/modules/tasks/entities/task.entity';

@Table({ tableName: 'projects', timestamps: true })
export class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare managerId: number;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  declare description: string;

  @Column({ allowNull: false })
  declare status: 'planned' | 'active' | 'completed' | 'cancelled';

  @Column({ type: DataType.DATE, allowNull: true })
  declare startDate: CreationOptional<Date | null>;

  @Column({ type: DataType.DATE, allowNull: true })
  declare endDate: CreationOptional<Date | null>;

  @BelongsTo(() => User)
  declare manager?: NonAttribute<User>;

  @HasMany(() => Task)
  declare tasks?: NonAttribute<Task[]>;
}
