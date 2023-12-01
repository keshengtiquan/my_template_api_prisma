import { IsInt, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryOptionsDto {
  @Min(1, { message: 'current最小值为1' })
  @IsInt({ message: 'current必须是数字' })
  @Type(() => Number)
  @IsOptional()
  current: number

  @Min(1, { message: 'pageSize最小值为1' })
  @IsInt({ message: 'pageSize必须是数字' })
  @Type(() => Number)
  @IsOptional()
  pageSize: number

  @IsOptional()
  sortField: string
  @IsOptional()
  sortOrder: string
}
