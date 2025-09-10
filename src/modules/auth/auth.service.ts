import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/modules/users/users.service';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from '@/common/interfaces/user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await user.comparePassword(pass))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME') || '7d',
    });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: user.toResponseObject(),
    };
  }

  async refreshToken(token: string) {
    const payload = await this.jwtService
      .verifyAsync<UserPayload>(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      })
      .catch(() => {
        throw new UnauthorizedException(
          'Token de refresh inválido ou expirado.',
        );
      });

    const user = await this.usersService.findOne(payload.sub);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Acesso negado.');
    }

    const refreshTokenMatches = await bcrypt.compare(token, user.refreshToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Acesso negado.');
    }

    const newPayload: UserPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const newAccessToken = this.jwtService.sign(newPayload);

    return { accessToken: newAccessToken };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return user.toResponseObject();
  }
}
