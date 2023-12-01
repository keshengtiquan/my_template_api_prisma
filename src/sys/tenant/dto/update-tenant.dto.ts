import { IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateTenantDto {
  id: number
  @IsNotEmpty({ message: '联系人不能为空' })
  contactUserName: string
  @IsNotEmpty({ message: '联系电话不能为空' })
  contactPhone: string
  @IsNotEmpty({ message: '公司名称不能为空' })
  companyName: string
  @IsOptional()
  address: string
  @IsOptional()
  status: string
  @IsOptional()
  createBy: string
  @IsOptional()
  updateBy: string
  @IsOptional()
  packageId: number
}
