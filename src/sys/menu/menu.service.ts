import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { handleTree } from '../../utils'
import { UpdateMenuDto } from './dto/update-menu.dto'

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
        data: createMenuDto,
      })
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 查询菜单列表
   * @param conditions 菜单类型数组
   * @param status 菜单状态数组
   */
  async getMenu(conditions: string[], status: string[]) {
    try {
      const menuList = await this.prisma.sys_menu.findMany({
        where: {
          menuType: {
            in: conditions,
          },
          status: {
            in: status,
          },
        },
        orderBy: {
          menuSort: 'asc',
        },
      })
      return handleTree(menuList)
    } catch (e) {
      throw new HttpException('查询菜单列表失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 更新菜单
   * @param updateMenuDto
   */
  async update(updateMenuDto: UpdateMenuDto) {
    const { id, ...fields } = updateMenuDto
    try {
      return await this.prisma.sys_menu.update({
        where: {
          id: id,
        },
        data: {
          ...fields,
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
}
