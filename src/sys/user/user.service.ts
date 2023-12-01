import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { md5 } from '../../utils'
import { User } from '../../common/interface'
import { ManagementGroup } from '../../enums'
import { UserResultVo } from './vo/UserResultVo'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建用户
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto) {
    const findUserName = await this.prisma.sys_user.findFirst({
      where: { userName: createUserDto.userName },
    })
    if (findUserName) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST)
    }
    const createRoles = createUserDto.roleIds.map((id) => {
      return {
        role: {
          connect: {
            id,
          },
        },
      }
    })
    try {
      await this.prisma.sys_user.create({
        data: {
          userName: createUserDto.userName,
          password: md5(createUserDto.password),
          nickName: createUserDto.nickName,
          email: createUserDto.email,
          phoneNumber: createUserDto.phoneNumber,
          gender: createUserDto.gender,
          avatar: createUserDto.avatar,
          createDept: createUserDto.createDept,
          remark: createUserDto.remark,
          createBy: createUserDto.createBy,
          updateBy: createUserDto.updateBy,
          tenantId: createUserDto.tenantId,
          deptId: createUserDto.deptId,
          roles: {
            create: createRoles,
          },
        },
      })
      return '注册成功'
    } catch (e) {
      return '注册失败'
    }
  }

  /**
   * 查询用户列表
   * @param current
   * @param pageSize
   */
  async getList(current: number, pageSize: number, nickName: string, sortField: string, sortOrder: string, user: User) {
    const orderBy = {}
    if (sortField && sortOrder) {
      orderBy[sortField] = sortOrder
    } else {
      orderBy['createTime'] = 'desc'
    }
    const where: any = {}
    if (user.tenantId != ManagementGroup.ID) {
      where.tenantId = user.tenantId
    }
    if (nickName) {
      where.nickName = {
        contains: nickName,
      }
    }

    try {
      const res = await this.prisma.sys_user.findMany({
        skip: (current - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
        where,
        include: {
          roles: true,
        },
      })
      return {
        results: res,
        total: await this.prisma.sys_user.count({ where }),
        current: current,
        pageSize: pageSize,
      }
    } catch (e) {
      console.log(e)
      throw new HttpException('获取用户列表失败', HttpStatus.BAD_REQUEST)
    }
  }
  /**
   * 禁用用户
   * @param id
   * @param status
   */
  async forbidden(id: number, status: string, user: User) {
    const res = await this.prisma.sys_user.findUnique({ where: { id } })
    console.log(res)
    if (user.tenantId != ManagementGroup.ID && res.userType === 'sys_user' && status === '1') {
      throw new HttpException('你无权限禁用系统用户', HttpStatus.FORBIDDEN)
    }
    try {
      return await this.prisma.sys_user.update({
        where: { id },
        data: {
          status: status,
        },
      })
    } catch (e) {
      console.log(e)
      throw new HttpException('禁用失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 根据ID获取用户信息
   * @param id
   */
  async getOneById(id: number) {
    try {
      const res = await this.prisma.sys_user.findUnique({
        where: { id },
        include: {
          roles: {
            select: {
              roleId: true,
            },
          },
        },
      })
      const userVo = new UserResultVo()
      userVo.roleIds = res.roles.map((item) => item.roleId)
      userVo.id = res.id
      userVo.tenantId = res.tenantId
      userVo.userType = res.userType
      userVo.userName = res.userName
      userVo.nickName = res.nickName
      userVo.email = res.email
      userVo.phoneNumber = res.phoneNumber
      userVo.gender = res.gender
      userVo.avatar = res.avatar
      userVo.status = res.status
      userVo.createDept = res.createDept
      userVo.remark = res.remark
      userVo.createBy = res.createBy
      userVo.updateBy = res.updateBy
      userVo.createTime = res.createTime
      userVo.updateTime = res.updateTime
      userVo.deptId = res.deptId
      return userVo
    } catch (e) {
      throw new HttpException('查询用户失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 更新用户
   * @param user
   * @param updateUserDto
   */
  async update(updateUserDto: UpdateUserDto, user: User) {
    const createRoles = updateUserDto.roleIds.map((id) => {
      return {
        role: {
          connect: {
            id,
          },
        },
      }
    })
    try {
      await this.prisma.sys_user.update({
        where: { id: updateUserDto.id },
        data: {
          userName: updateUserDto.userName,
          nickName: updateUserDto.nickName,
          email: updateUserDto.email,
          phoneNumber: updateUserDto.phoneNumber,
          gender: updateUserDto.gender,
          avatar: updateUserDto.avatar,
          remark: updateUserDto.remark,
          updateBy: user.nickName,
          deptId: updateUserDto.deptId,
          roles: {
            deleteMany: { userId: updateUserDto.id },
            create: createRoles,
          },
        },
      })
    } catch (e) {
      throw new BadRequestException('更新用户失败')
    }
  }

  /**
   * 删除用户
   * @param id
   * @param user
   */
  async delete(id: number, user: User) {
    if (id === user.id) {
      throw new BadRequestException('不能删除自己')
    }
    if (user.tenantId !== ManagementGroup.ID && user.userType !== 'sys_user') {
      console.log(218)
      throw new BadRequestException('你无权限删除系统用户')
    }
    try {
      return await this.prisma.sys_user.delete({ where: { id } })
    } catch (e) {
      console.log(e)
      throw new BadRequestException('删除用户失败')
    }
  }
}
