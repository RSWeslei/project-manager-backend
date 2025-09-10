import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AuthUserService } from '@/modules/auth/auth-user.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authUser: AuthUserService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar usuário' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuários (suporta ?q=&limit=)' })
  findAll(
    @Query('q') q?: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    if (q && q.trim().length > 0) {
      return this.usersService.search(q, limit);
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter usuário por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Post('photo')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Enviar foto do usuário atual' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/photos',
        filename: (_req, file, cb) => {
          const rand = Array.from({ length: 24 })
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${rand}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    const userId = this.authUser.getUserId();
    const photoUrl = `${process.env.APP_URL}/photos/${file.filename}`;
    return this.usersService.updatePhoto(userId, photoUrl);
  }
}
