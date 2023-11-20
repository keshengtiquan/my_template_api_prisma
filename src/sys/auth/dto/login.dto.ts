import { IsNotEmpty } from 'class-validator'
import { IsExistRule } from '../../../common/rules/is-exist.rule'

export class LoginDto {
  @IsNotEmpty({ message: '账号不能为空' })
  @IsExistRule('sys_user', { message: '账号不存在' })
  userName: string

  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}
