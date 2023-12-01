import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { handleTree } from '../../utils'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { ManagementGroup } from '../../enums'

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建菜单
   * @param createMenuDto
   */
  async create(createMenuDto: CreateMenuDto) {
    try {
      return await this.prisma.sys_menu.create({
        data: {
          title: createMenuDto.title,
          icon: createMenuDto.icon,
          path: createMenuDto.path,
          component: createMenuDto.component,
          name: createMenuDto.name,
          hideInMenu: createMenuDto.hideInMenu,
          parentId: createMenuDto.parentId,
          isIframe: createMenuDto.isIframe,
          url: createMenuDto.url,
          affix: createMenuDto.affix,
          hideInBreadcrumb: createMenuDto.hideInBreadcrumb,
          hideChildrenInMenu: createMenuDto.hideChildrenInMenu,
          keepAlive: createMenuDto.keepAlive,
          target: createMenuDto.target,
          redirect: createMenuDto.redirect,
          menuSort: createMenuDto.menuSort,
          permission: createMenuDto.permission,
          status: createMenuDto.status,
          createBy: createMenuDto.createBy,
          updateBy: createMenuDto.updateBy,
          menuType: createMenuDto.menuType,
        },
      })
    } catch (e) {
      throw new HttpException('菜单创建失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 查询菜单列表
   * @param conditions 菜单类型数组
   * @param status 菜单状态数组
   */
  async getMenu(conditions: string[], status: string[], user: any) {
    const where: any = {
      menuType: {
        in: conditions,
      },
      status: {
        in: status,
      },
    }
    //如果用户不是管理组, 只返回查询人套餐内的菜单
    if (user.tenantId !== ManagementGroup.ID) {
      const roleIds = user.roles.map((item) => item.roleId)
      const tenant = await this.prisma.sys_tenant.findUnique({
        where: { id: user.tenantId },
        include: { package: { select: { menuIds: true } } },
      })
      where.id = {
        in: tenant.package.menuIds.split(',').map((item) => Number(item)),
      }
      if (user.userType !== 'sys_user') {
        where.roles = {
          some: {
            roleId: {
              in: roleIds,
            },
          },
        }
      }
    }
    try {
      const menuList = await this.prisma.sys_menu.findMany({
        where: where,
        orderBy: {
          menuSort: 'asc',
        },
      })
      return handleTree(menuList)
    } catch (e) {
      console.log(e)
      throw new HttpException('查询菜单列表失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 更新菜单
   * @param updateMenuDto
   */
  async update(updateMenuDto: UpdateMenuDto) {
    const { id } = updateMenuDto
    try {
      return await this.prisma.sys_menu.update({
        where: {
          id: id,
        },
        data: {
          title: updateMenuDto.title,
          icon: updateMenuDto.icon,
          path: updateMenuDto.path,
          component: updateMenuDto.component,
          name: updateMenuDto.name,
          hideInMenu: updateMenuDto.hideInMenu,
          parentId: updateMenuDto.parentId,
          isIframe: updateMenuDto.isIframe,
          url: updateMenuDto.url,
          affix: updateMenuDto.affix,
          hideInBreadcrumb: updateMenuDto.hideInBreadcrumb,
          hideChildrenInMenu: updateMenuDto.hideChildrenInMenu,
          keepAlive: updateMenuDto.keepAlive,
          target: updateMenuDto.target,
          redirect: updateMenuDto.redirect,
          menuSort: updateMenuDto.menuSort,
          permission: updateMenuDto.permission,
          status: updateMenuDto.status,
          updateBy: updateMenuDto.updateBy,
          menuType: updateMenuDto.menuType,
        },
      })
    } catch (e) {
      throw new HttpException('更新菜单失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 根据ID查询菜单
   * @param id
   */
  async getMenuById(id: number) {
    try {
      return await this.prisma.sys_menu.findUnique({
        where: { id },
      })
    } catch (e) {
      throw new HttpException('查询菜单失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 删除菜单
   * @param number
   */
  async delete(id: number) {
    try {
      return await this.prisma.sys_menu.delete({
        where: {
          id,
        },
      })
    } catch (e) {
      throw new HttpException('菜单删除失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 禁用菜单
   * @param id 菜单ID
   * @param ststus 菜单状态 0 启用， 1禁用
   */
  async forbidden(id: number, status: string) {
    try {
      return await this.prisma.sys_menu.update({
        where: { id },
        data: {
          status: status,
        },
      })
    } catch (e) {
      throw new HttpException('菜单禁用失败', HttpStatus.BAD_REQUEST)
    }
  }
}
