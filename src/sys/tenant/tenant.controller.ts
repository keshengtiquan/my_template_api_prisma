import { Controller, Post, Body, UseInterceptors, Query, Get } from '@nestjs/common'
import { TenantService } from './tenant.service'
import { CreateTenantDto } from './dto/create-tenant.dto'
import { Auth } from '../auth/decorators/auth.decorators'
import { AddUserToDtoInterceptor } from '../../interceptor/addUser.interceptor'
import { Result } from '../../common/results'
import { FindTenantDto } from './dto/find-tenant.dto'
import { CurrentUser } from '../../decorators/user.dectorator'
import { User } from '../../common/interface'
import { UtcToLocalInterceptor } from '../../interceptor/utc2Local.interceptor'
import { generateParseIntPipe } from '../../utils'
import { UpdateTenantDto } from './dto/update-tenant.dto'

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * 创建租户
   * @param createTenantDto
   */
  @Post('/create')
  @Auth()
  @UseInterceptors(AddUserToDtoInterceptor)
  async create(@Body() createTenantDto: CreateTenantDto) {
    const data = await this.tenantService.create(createTenantDto)
    return Result.success(data, '创建成功')
  }

  /**
   * 查询租户列表
   * @param findTenantDto
   */
  @Get('/getlist')
  @UseInterceptors(UtcToLocalInterceptor)
  @Auth()
  async getList(@Query() findTenantDto: FindTenantDto, @CurrentUser() currentUser: User) {
    const data = await this.tenantService.findList(findTenantDto, currentUser)
    return Result.success(data)
  }

  /**
   * 禁用租户
   * @param id 租户id
   * @param status 1启用 0 禁用
   */
  @Post('/forbidden')
  @Auth()
  async forbiddenTenant(@Body('id') id: number, @Body('status') status: string) {
    const data = await this.tenantService.forbidden(id, status)
    return Result.success(data, status === '1' ? '启用成功' : '禁用成功')
  }

  /**
   * 查询租户
   * @param id 租户ID
   */
  @Get('/get')
  @Auth()
  async getOne(@Query('id', generateParseIntPipe('id')) id: number) {
    const data = await this.tenantService.getOne(id)
    return Result.success(data)
  }

  /**
   * 更新租户
   * @param updateTenantDto
   */
  @Post('/update')
  @UseInterceptors(AddUserToDtoInterceptor)
  @Auth()
  async updateTenant(@Body() updateTenantDto: UpdateTenantDto) {
    const data = await this.tenantService.updateTenant(updateTenantDto)
    return Result.success(data, '更新租户成功')
  }

  /**
   * 删除租户
   * @param id
   */
  @Post('/delete')
  @Auth()
  async deleteTenant(@Body('id', generateParseIntPipe('id')) id: number) {
    const data = await this.tenantService.deleteTenant(id)
    return Result.success(data, '删除租户成功')
  }
}
