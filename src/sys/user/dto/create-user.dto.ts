import { IsNotEmpty, IsOptional } from 'class-validator'
import { IsNotExistsRule } from '../../../common/rules/is-not-exist.rule'

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsNotExistsRule('sys_user', { message: '用户名已存在' })
  userName: string

  @IsNotEmpty({ message: '密码不能为空' })
  password: string

  @IsOptional()
  nickName: string
}
