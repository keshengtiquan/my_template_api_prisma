import { IsNotEmpty } from 'class-validator'
import { IsNotExistsRule } from '../../../common/rules/is-not-exist.rule'
import { Type } from 'class-transformer'

export class CreateRoleDto {
  @IsNotEmpty({ message: '角色名称不能为空' })
  @IsNotExistsRule('sys_role', { message: '角色名称已存在' })
  roleName: string

  @IsNotEmpty({ message: '角色标识不能为空' })
  @IsNotExistsRule('sys_role', { message: '角色标识已存在' })
  roleKey: string

  @IsNotEmpty({ message: '角色排序不能为空' })
  @Type(() => Number)
  roleSort: number
}
