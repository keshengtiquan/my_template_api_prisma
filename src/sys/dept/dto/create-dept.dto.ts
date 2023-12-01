import { IsNotEmpty, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateDeptDto {
  @IsOptional()
  tenantId: number
  @IsOptional()
  @Type(() => Number)
  parentId: number
  @IsNotEmpty({ message: 'deptName不能为空' })
  deptName: string
  @IsOptional()
  leader: number
  phone: string
  @IsOptional()
  email: string
  @IsOptional()
  status: string
  @IsOptional()
  createBy: string
  @IsOptional()
  updateBy: string
}
