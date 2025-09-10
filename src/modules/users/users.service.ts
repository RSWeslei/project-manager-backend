import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, UniqueConstraintError } from 'sequelize';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const created = await this.userModel.create({
        name: dto.name,
        email: dto.email,
        password: dto.password,
        role: dto.role,
      });
      return created.toResponseObject() as unknown as User;
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new ConflictException('Email already in use');
      }
      throw e;
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.findAll({
      attributes: { exclude: ['password', 'refreshToken'] },
      order: [['name', 'ASC']],
    });
    return users.map((u) => u.toResponseObject() as unknown as User);
  }

  async search(
    q: string,
    limit = 20,
  ): Promise<Pick<User, 'id' | 'name' | 'email' | 'photoUrl'>[]> {
    const term = (q ?? '').trim();

    return await this.userModel.findAll({
      where: term
        ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${term}%` } },
              { email: { [Op.iLike]: `%${term}%` } },
            ],
          }
        : undefined,
      attributes: ['id', 'name', 'email', 'photoUrl'],
      order: [['name', 'ASC']],
      limit: Math.min(Math.max(Number(limit) || 20, 1), 50),
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    return user.toResponseObject() as unknown as User;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');

    if (dto.email && dto.email !== user.email) {
      const exists = await this.userModel.findOne({
        where: { email: dto.email },
      });
      if (exists) throw new ConflictException('Email already in use');
    }

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(dto.password, salt);
    }
    if (dto.role !== undefined) user.role = dto.role;

    await user.save();
    return user.toResponseObject() as unknown as User;
  }

  async remove(id: number): Promise<{ id: number }> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    await user.destroy();
    return { id };
  }

  async updatePhoto(userId: number, photoUrl: string): Promise<User> {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('User not found');
    user.photoUrl = photoUrl;
    await user.save();
    return user.toResponseObject() as unknown as User;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.userModel.update(
      { refreshToken: hashedRefreshToken },
      { where: { id: userId } },
    );
  }
}
