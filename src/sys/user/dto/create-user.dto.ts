import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  userName: string

  @IsNotEmpty({ message: '密码不能为空' })
  password: string

  @IsOptional()
  nickName: string
  @IsOptional()
  email: string
  @IsOptional()
  phoneNumber: string
  @IsOptional()
  gender: string
  @IsOptional()
  avatar: string
  @IsOptional()
  status: string
  @IsOptional()
  createDept: number
  @IsOptional()
  remark: string
  @IsOptional()
  createBy: string
  @IsOptional()
  updateBy: string
  @IsOptional()
  tenantId: number
  @IsOptional()
  deptId: number
  @IsOptional()
  roleIds: number[]
}
