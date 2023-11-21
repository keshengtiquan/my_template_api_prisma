import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    console.log(typeof createRoleDto.roleSort)
    try {
      return await this.prisma.sys_role.create({
        data: {
          roleName: createRoleDto.roleName,
          roleKey: createRoleDto.roleKey,
          roleSort: createRoleDto.roleSort,
        },
      })
    } catch (e) {
      console.log(e)
      throw new HttpException('创建角色失败', HttpStatus.BAD_REQUEST)
    }
  }
}
