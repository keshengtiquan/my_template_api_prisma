import { Controller, Post, Body, HttpCode, UseInterceptors, Get, Query } from '@nestjs/common'
import { MenuService } from './menu.service'
import { CreateMenuDto } from './dto/create-menu.dto'
import { Auth } from '../auth/decorators/auth.decorators'
import { AddUserToDtoInterceptor } from '../../interceptor/addUser.interceptor'
import { UtcToLocalInterceptor } from '../../interceptor/utc2Local.interceptor'
import { Result } from '../../common/results'
import { UpdateMenuDto } from './dto/update-menu.dto'

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * 创建菜单
   * @param createMenuDto
   */
  @Post('/create')
  @HttpCode(200)
  @Auth()
  @UseInterceptors(new AddUserToDtoInterceptor())
  async create(@Body() createMenuDto: CreateMenuDto) {
    const data = await this.menuService.create(createMenuDto)
    return Result.success(data, '菜单创建成功')
  }

  /**
   * 查询侧边菜单数据
   */
  @Get('/getMenu')
  @Auth()
  @HttpCode(200)
  async getMenu() {
    const data = await this.menuService.getMenu(['C', 'M'], ['0'])
    return Result.success(data)
  }

  /**
   * 查询菜单列表
   */
  @Get('/getMenuList')
  @Auth()
  @UseInterceptors(UtcToLocalInterceptor)
  async getMenuList() {
    const data = await this.menuService.getMenu(['C', 'M', 'F'], ['0', '1'])
    return Result.success(data)
  }

  /**
   * 更新菜单
   * @param updateMenuDto
   */
  @Post('/update')
  @Auth()
  @UseInterceptors(AddUserToDtoInterceptor)
  async updateMenu(@Body() updateMenuDto: UpdateMenuDto) {
    delete updateMenuDto.createBy
    const data = await this.menuService.update(updateMenuDto)
    return Result.success(data, '菜单更新成功')
  }

  /**
   * 根据ID查询菜单单条
   * @param id 菜单ID
   */
  @Get('/getOne')
  @Auth()
  async getMenuById(@Query('id') id: number) {
    const data = await this.menuService.getMenuById(+id)
    return Result.success(data)
  }

  /**
   * 删除菜单
   * @param id
   */
  @Post('/delete')
  @Auth()
  async deleteMenuById(@Body('id') id: number) {
    const data = await this.menuService.delete(+id)
    return Result.success(data, '删除成功')
  }
}
