import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { Auth } from '../auth/decorators/auth.decorators'
import { Result } from '../../common/results'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/create')
  @Auth()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const data = await this.roleService.create(createRoleDto)
    return Result.success(data)
  }
}
