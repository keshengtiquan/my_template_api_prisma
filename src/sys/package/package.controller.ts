import { Controller, Get, Post, Body, UseInterceptors, Query } from '@nestjs/common'
import { PackageService } from './package.service'
import { CreatePackageDto } from './dto/create-package.dto'
import { Auth } from '../auth/decorators/auth.decorators'
import { AddUserToDtoInterceptor } from '../../interceptor/addUser.interceptor'
import { Result } from '../../common/results'
import { generateParseIntPipe } from '../../utils'
import { UtcToLocalInterceptor } from '../../interceptor/utc2Local.interceptor'
import { UpdatePackageDto } from './dto/update-package.dto'

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  /**
   * 创建套餐
   * @param createPackageDto
   */
  @Post('/create')
  @Auth()
  @UseInterceptors(AddUserToDtoInterceptor)
  async create(@Body() createPackageDto: CreatePackageDto) {
    const data = this.packageService.create(createPackageDto)
    return Result.success(data, '租户套餐创建成功')
  }

  /**
   * 查询套餐列表
   * @param current 当前页
   * @param pageSize 每页大小
   */
  @Get('/getList')
  @UseInterceptors(UtcToLocalInterceptor)
  @Auth()
  async getList(
    @Query('packageName') packageName: string,
    @Query('current', generateParseIntPipe('current')) current: number,
    @Query('pageSize', generateParseIntPipe('pageSize')) pageSize: number,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
  ) {
    const data = await this.packageService.getList(current, pageSize, sortField, sortOrder, packageName)
    console.log(data)
    return Result.success(data)
  }

  /**
   * 根据ID查询套餐
   * @param id
   */
  @Get('/get')
  @Auth()
  async getOne(@Query('id', generateParseIntPipe('id')) id: number) {
    const data = await this.packageService.getOne(id)
    return Result.success(data)
  }

  /**
   * 更新套餐
   * @param updatePackageDto
   */
  @Post('/update')
  @Auth()
  @UseInterceptors(AddUserToDtoInterceptor)
  async update(@Body() updatePackageDto: UpdatePackageDto) {
    const data = await this.packageService.update(updatePackageDto)
    return Result.success(data, '租户套餐更新成功')
  }

  /**
   * 删除套餐
   * @param id
   */
  @Post('/delete')
  @Auth()
  async delete(@Body('id', generateParseIntPipe('id')) id: number) {
    const data = await this.packageService.delete(id)
    return Result.success(data, '租户套餐删除成功')
  }
}
