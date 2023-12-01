import { Controller, Get, Post, Body, UseInterceptors, Query, DefaultValuePipe } from '@nestjs/common'
import { DeptService } from './dept.service'
import { CreateDeptDto } from './dto/create-dept.dto'
import { Auth } from '../auth/decorators/auth.decorators'
import { AddUserToDtoInterceptor } from '../../interceptor/addUser.interceptor'
import { Result } from '../../common/results'
import { generateParseIntPipe } from '../../utils'
import { CurrentUser } from '../../decorators/user.dectorator'
import { User } from '../../common/interface'
import { UtcToLocalInterceptor } from '../../interceptor/utc2Local.interceptor'
import { UpdateDeptDto } from './dto/update-dept.dto'

@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  /**
   * 创建部门
   * @param createDeptDto
   */
  @Post('/create')
  @Auth()
  @UseInterceptors(AddUserToDtoInterceptor)
  async create(@Body() createDeptDto: CreateDeptDto) {
    const data = this.deptService.create(createDeptDto)
    return Result.success(data, '创建部门成功')
  }

  /**
   * 查询部门列表
   * @param current
   * @param pageSize
   * @param sortField
   * @param sortOrder
   */
  @Get('/getlist')
  @UseInterceptors(UtcToLocalInterceptor)
  @Auth()
  async getList(
    @Query('current', new DefaultValuePipe(1), generateParseIntPipe('current')) current: number,
    @Query('pageSize', new DefaultValuePipe(10), generateParseIntPipe('pageSize')) pageSize: number,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
    @CurrentUser() user: User,
  ) {
    const data = await this.deptService.getlist(current, pageSize, sortField, sortOrder, user)
    return Result.success(data)
  }

  /**
   * 禁用部门
   * @param id 角色id
   * @param status 1启用 0 禁用
   */
  @Post('/forbidden')
  @Auth()
  async forbidden(@Body('id') id: number, @Body('status') status: string) {
    const data = await this.deptService.forbidden(id, status)
    return Result.success(data, status === '1' ? '禁用成功' : '启用成功')
  }

  /**
   * 根据ID查询部门
   * @param id
   */
  @Get('/get')
  @Auth()
  async getOneById(@Query('id', generateParseIntPipe('id')) id: number) {
    const data = await this.deptService.getOneById(id)
    return Result.success(data)
  }

  /**
   * 更新部门
   * @param updateDeptDto
   */
  @Post('/update')
  @Auth()
  @UseInterceptors(AddUserToDtoInterceptor)
  async update(@Body() updateDeptDto: UpdateDeptDto) {
    const data = await this.deptService.update(updateDeptDto)
    return Result.success(data, '更新部门成功')
  }

  /**
   * 删除部门
   * @param id
   */
  @Post('/delete')
  @Auth()
  async delete(@Body('id', generateParseIntPipe('id')) id: number) {
    const data = await this.deptService.delete(id)
    return Result.success(data, '删除部门成功')
  }
}
