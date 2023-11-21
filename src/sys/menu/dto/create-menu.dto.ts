import { IsNotEmpty, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { IsNotExistsRule } from '../../../common/rules/is-not-exist.rule'

export class CreateMenuDto {
  @IsNotEmpty({ message: '菜单名称不能为空' })
  title: string
  @IsOptional()
  icon: string
  @IsNotEmpty({ message: '菜单路径不能为空' })
  @IsNotExistsRule('sys_menu', { message: '路径重复' })
  path: string
  @IsOptional()
  component: string
  @IsOptional()
  @IsNotExistsRule('sys_menu', { message: '组件名称重复' })
  name: string
  @IsOptional()
  hideInMenu: boolean
  @IsOptional()
  @Type(() => Number)
  parentId: number
  @IsOptional()
  isIframe: boolean
  @IsOptional()
  url: string
  @IsOptional()
  affix: boolean
  @IsOptional()
  hideInBreadcrumb: boolean
  @IsOptional()
  hideChildrenInMenu: boolean
  @IsOptional()
  keepAlive: boolean
  @IsOptional()
  target: string
  @IsOptional()
  redirect: string
  @IsNotEmpty({ message: '排序不能为空' })
  @Type(() => Number)
  menuSort: number
  @IsOptional()
  permission: string
  @IsOptional()
  status: string
  @IsOptional()
  createBy: string
  @IsOptional()
  updateBy: string
}
