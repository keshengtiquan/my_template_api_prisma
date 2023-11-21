import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { md5 } from '../../utils'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      await this.prisma.sys_user.create({
        data: {
          userName: createUserDto.userName,
          password: md5(createUserDto.password),
          nickName: createUserDto.nickName,
        },
      })
      return '注册成功'
    } catch (e) {
      return '注册失败'
    }
  }

  findAll() {
    return `This action returns all user`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
