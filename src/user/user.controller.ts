import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TelegramAuthGuard } from 'src/auth/telegram.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



@Get('me')
@UseGuards(TelegramAuthGuard)
async getOrCreateUser(@Req() req) {
  console.log('req.user (from guard):', req.user);

  const userData = {
    telegramId: req.user.telegramId,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    username: req.user.username,
    photoUrl: req.user.photoUrl,
  };

  const user = await this.userService.createOrUpdate(userData);
  return user;
}


  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
