import { Injectable } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { handleTree } from '../../utils'

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}
  async create(createMenuDto: CreateMenuDto) {
    try {
      return await this.prisma.sys_menu.create({
        data: createMenuDto,
      })
    } catch (e) {
      console.log(e)
    }
  }

  async getMenu(conditions: string[]) {
    const menuList = await this.prisma.sys_menu.findMany({
      where: {
        menuType: {
          in: conditions,
        },
      },
      orderBy: {
        menuSort: 'asc',
      },
    })
    return handleTree(menuList)
  }
}
