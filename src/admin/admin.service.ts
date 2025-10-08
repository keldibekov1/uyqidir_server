import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto, LoginAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(data: CreateAdminDto) {
    const username = await this.prisma.admin.findUnique({
      where: { username: data.username },
    });
    if (username) {
      throw new BadRequestException('Bu username allaqachon band');
    }
    const hashedPassword = await bcrypt.hash(data.password, 8);

    return await this.prisma.admin.create({
      data: { ...data, password: hashedPassword },
      omit:{password:true}
    });
  }
  async login(data: LoginAdminDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { username: data.username },
    });
    if (!admin) {
      throw new UnauthorizedException('Username yoki password xato');
    }
    const isMatch = await bcrypt.compare(data.password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException('Username yoki password xato');
    }
    const token = this.jwtService.sign({
      id: admin.id,
      username: admin.username,
    });

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    return { token };
  }

  async findAll() {
    return await this.prisma.admin.findMany();
  }

  async findOne(id: string) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException('Bunday admin topilmadi');
    return admin;
  }

  async update(id: string, data: UpdateAdminDto) {
    try {
      return await this.prisma.admin.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('Bunday admin topilmadi');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.admin.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Bunday admin topilmadi');
    }
  }
}
