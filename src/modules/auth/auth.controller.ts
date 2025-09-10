import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UsersService } from '@/modules/users/users.service';
import { UserPayload } from '@/common/interfaces/user-payload.interface';

@ApiTags('autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login de um usuário' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar o token de acesso' })
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter o perfil do usuário atual' })
  getProfile(@Request() req: { user: UserPayload }) {
    return this.usersService.findOne(req.user.sub);
  }
}
