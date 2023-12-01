import { Controller, Get, Post, Body, HttpCode, Query, DefaultValuePipe, UseInterceptors, Res } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Auth } from '../auth/decorators/auth.decorators'
import { generateParseIntPipe } from '../../utils'
import { Result } from '../../common/results'
import { CurrentUser } from '../../decorators/user.dectorator'
import { User } from '../../common/interface'
import { AddUserToDtoInterceptor } from '../../interceptor/addUser.interceptor'
import { UtcToLocalInterceptor } from '../../interceptor/utc2Local.interceptor'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建用户
   * @param createUserDto
   */
  @Post('/create')
  @Auth()
  @HttpCode(200)
  @UseInterceptors(AddUserToDtoInterceptor)
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto)
    return Result.success(data, '用户创建成功')
  }

  /**
   * 查询用户列表
   * @param current
   * @param pageSize
   */
  @Get('/getlist')
  @Auth()
  @UseInterceptors(UtcToLocalInterceptor)
  async getlist(
    @CurrentUser('tenantId') user: User,
    @Query('current', new DefaultValuePipe(1), generateParseIntPipe('current')) current: number,
    @Query('pageSize', new DefaultValuePipe(10), generateParseIntPipe('pageSize')) pageSize: number,
    @Query('nickName') nickName: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
  ) {
    const data = await this.userService.getList(current, pageSize, nickName, sortField, sortOrder, user)
    return Result.success(data)
  }

  /**
   * 禁用用户
   * @param id
   * @param status
   */
  @Post('/forbidden')
  @Auth()
  async forbiddenUser(@Body('id') id: number, @Body('status') status: string, @CurrentUser() user: User) {
    const data = await this.userService.forbidden(id, status, user)
    return Result.success(data, status === '1' ? '禁用成功' : '启用成功')
  }

  /**
   * 根据ID获取用户信息
   * @param id
   */
  @Get('/get')
  @Auth()
  async getOneById(@Query('id', generateParseIntPipe('id')) id: number) {
    const data = await this.userService.getOneById(id)
    return Result.success(data)
  }

  /**
   * 更新用户
   * @param user
   * @param updateUserDto
   */
  @Post('/update')
  @Auth()
  async update(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.userService.update(updateUserDto, user)
    return Result.success(data, '用户更新成功')
  }

  /**
   * 删除用户
   * @param id
   */
  @Post('/delete')
  @Auth()
  async delete(@Body('id', generateParseIntPipe('id')) id: number, @CurrentUser() user: User) {
    const data = await this.userService.delete(id, user)
    return Result.success(data, '删除用户成功')
  }
}
