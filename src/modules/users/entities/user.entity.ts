import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BeforeCreate,
} from 'sequelize-typescript';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import * as bcrypt from 'bcrypt';
import { Project } from '@/modules/projects/entities/project.entity';
import { Task } from '@/modules/tasks/entities/task.entity';
import { ProjectMember } from '@/modules/project-members/entities/project-member.entity';

@Table({ tableName: 'users', timestamps: true, paranoid: true })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare role: 'admin' | 'manager' | 'developer';

  @Column({ type: DataType.STRING, allowNull: true })
  declare photoUrl: string | null;

  @HasMany(() => Project, 'managerId')
  declare managedProjects?: NonAttribute<Project[]>;

  @HasMany(() => Task, 'assigneeId')
  declare assignedTasks?: NonAttribute<Task[]>;

  @HasMany(() => ProjectMember)
  declare projectMemberships?: NonAttribute<ProjectMember[]>;

  @BeforeCreate
  static async hashPassword(instance: User) {
    if (instance.password) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
