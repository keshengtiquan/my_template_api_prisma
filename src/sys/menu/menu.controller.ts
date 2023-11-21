import { Controller, Post, Body, HttpCode, UseInterceptors, Get, Res } from '@nestjs/common'
import { MenuService } from './menu.service'
import { CreateMenuDto } from './dto/create-menu.dto'
import { Auth } from '../auth/decorators/auth.decorators'
import { AddUserToDtoInterceptor } from '../../interceptor/addUser.interceptor'
import { UtcToLocalInterceptor } from '../../interceptor/utc2Local.interceptor'
import { ResponseInterceptor } from '../../interceptor/response.interceptor'
import { Result } from '../../common/results'

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('/create')
  @HttpCode(200)
  @Auth()
  @UseInterceptors(new AddUserToDtoInterceptor())
  async create(@Body() createMenuDto: CreateMenuDto) {
    const data = await this.menuService.create(createMenuDto)
    return Result.success(data)
  }

  @Get('/getMenu')
  @Auth()
  @HttpCode(200)
  async getMenu() {
    const data = await this.menuService.getMenu(['C', 'M'])
    return Result.success(data)
  }

  @Get('/getMenuList')
  @Auth()
  @UseInterceptors(UtcToLocalInterceptor)
  async getMenuList() {
    const data = await this.menuService.getMenu(['C', 'M', 'F'])
    return Result.success(data)
  }
}
