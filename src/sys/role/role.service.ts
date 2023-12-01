import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { WINSTON_LOGGER_TOKEN } from '../../winston/winston.module'
import { UpdateRoleDto } from './dto/update-role.dto'
import { User } from '../../common/interface'

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}
  @Inject(WINSTON_LOGGER_TOKEN)
  private logger

  /**
   * 创建角色
   * @param createRoleDto
   */
  async create(createRoleDto: CreateRoleDto) {
    const findRoleName = await this.prisma.sys_role.findFirst({
      where: { roleName: createRoleDto.roleName, tenantId: createRoleDto.tenantId },
    })
    if (findRoleName) {
      throw new HttpException('角色名称已存在', HttpStatus.BAD_REQUEST)
    }
    const findRoleKey = await this.prisma.sys_role.findFirst({
      where: { roleName: createRoleDto.roleKey, tenantId: createRoleDto.tenantId },
    })
    if (findRoleKey) {
      throw new HttpException('角色标识已存在', HttpStatus.BAD_REQUEST)
    }
    try {
      if (createRoleDto.menuIds.length === 0) {
        throw new HttpException('请选择菜单', HttpStatus.BAD_REQUEST)
      }
      const createMenus = createRoleDto.menuIds.map((id) => {
        return {
          menu: {
            connect: {
              id,
            },
          },
        }
      })

      return await this.prisma.sys_role.create({
        data: {
          roleName: createRoleDto.roleName,
          roleKey: createRoleDto.roleKey,
          roleSort: createRoleDto.roleSort,
          remark: createRoleDto.remark,
          tenantId: createRoleDto.tenantId,
          createBy: createRoleDto.createBy,
          updateBy: createRoleDto.updateBy,
          createDept: createRoleDto.createDept,
          menus: {
            create: createMenus,
          },
        },
      })
    } catch (e) {
      this.logger.error(e.message, '创建角色')
      throw new HttpException('创建角色失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 获取角色列表
   * @param current 当前页码
   * @param pageSize 页码大小
   */
  async getList(current: number, pageSize: number, sortField: string, sortOrder: string, user: User) {
    const orderBy = {}
    if (sortField && sortOrder) {
      orderBy[sortField] = sortOrder
    } else {
      orderBy['createTime'] = 'desc'
    }
    const where = {
      tenantId: user.tenantId,
    }
    try {
      const res = await this.prisma.sys_role.findMany({
        skip: (current - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
        where,
      })

      return {
        results: res,
        total: await this.prisma.sys_role.count(),
        current: current,
        pageSize: pageSize,
      }
    } catch (e) {
      throw new HttpException('获取列表失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 禁用租户
   * @param id 角色id
   * @param status 1启用 0 禁用
   */
  async forbidden(id: number, status: string) {
    try {
      return await this.prisma.sys_role.update({
        where: { id },
        data: {
          status: status,
        },
      })
    } catch (e) {
      throw new HttpException('禁用失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 根据id查询角色
   * @param id
   */
  async getOneById(id: number) {
    try {
      return await this.prisma.sys_role.findUnique({
        where: { id },
        include: { menus: { select: { menuId: true } } },
      })
    } catch (e) {
      this.logger.error('查询角色失败', e.message)
      throw new HttpException('查询角色失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 更新角色
   * @param updateRoleDto
   */
  async update(updateRoleDto: UpdateRoleDto) {
    try {
      if (updateRoleDto.menuIds.length === 0) {
        throw new HttpException('请选择菜单', HttpStatus.BAD_REQUEST)
      }
      const createMenus = updateRoleDto.menuIds.map((id) => {
        return {
          menu: {
            connect: {
              id,
            },
          },
        }
      })
      return await this.prisma.sys_role.update({
        where: { id: updateRoleDto.id },
        data: {
          roleName: updateRoleDto.roleName,
          roleKey: updateRoleDto.roleKey,
          roleSort: updateRoleDto.roleSort,
          updateBy: updateRoleDto.updateBy,
          remark: updateRoleDto.remark,
          menus: {
            deleteMany: { roleId: updateRoleDto.id },
            create: createMenus,
          },
        },
      })
    } catch (e) {
      this.logger.error(e.message, e)
      throw new HttpException('更新角色失败', HttpStatus.BAD_REQUEST)
    }
  }
  /**
   * 删除角色
   * @param id
   */
  async delete(id: number) {
    try {
      return await this.prisma.sys_role.delete({
        where: { id },
      })
    } catch (e) {
      this.logger.error(e.message, e)
      throw new HttpException('删除角色失败', HttpStatus.BAD_REQUEST)
    }
  }
}
