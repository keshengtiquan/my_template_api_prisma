import { QueryOptionsDto } from '../../../common/base/dto/query.options.dto'
import { IsOptional } from 'class-validator'

export class FindTenantDto extends QueryOptionsDto {
  @IsOptional()
  status: string
  @IsOptional()
  contactUserName: string
  @IsOptional()
  companyName: string
}
