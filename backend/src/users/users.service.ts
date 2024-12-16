import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login-dto';
import { randomBytes } from 'node:crypto';

@Injectable()
export class UsersService {

  constructor(private readonly db: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPw = await argon2.hash(createUserDto.password);
    const newUser = await this.db.user.create({
      data: {
        ...createUserDto,
        password: hashedPw,
      }
    });
    delete newUser.password;
    return newUser;
  }

  findAll() {
    return this.db.user.findMany;
  }

  findOne(id: number) {
    return this.db.user.findUnique({
      where: {id}
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.db.user.update({
      where: {id},
      data: updateUserDto
    });
  }

  remove(id: number) {
    return this.db.user.delete({
      where: {id}
    });
  }

  async login(loginData: LoginDto) {
    const user = await this.db.user.findUniqueOrThrow({
      where: {
        username: loginData.username
      }
    });
    if (await argon2.verify(await user.password, loginData.password)) {
      const token = randomBytes(32).toString('hex');
      await this.db.token.create({
        data: {
          token,
          user: {
            connect: { id: user.id }
          }
        }
      })
      return {
        token: token,
        userId: user.id,
      }
    } else {
      throw new Error('Invalid password');
    }
  }

  async findUserByToken(token: string) {
    const tokenData = await this.db.token.findUnique({
      where: { token },
      include: { user: true }
    })
    if (!tokenData) return null;
    const user = tokenData.user;
    delete user.password;
    
    return user;
  }
}
