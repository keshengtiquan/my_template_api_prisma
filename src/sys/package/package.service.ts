import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { CreatePackageDto } from './dto/create-package.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdatePackageDto } from './dto/update-package.dto'

@Injectable()
export class PackageService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建套餐
   * @param createPackageDto
   */
  async create(createPackageDto: CreatePackageDto) {
    try {
      await this.prisma.sys_tenant_package.create({
        data: {
          packageName: createPackageDto.packageName,
          remark: createPackageDto.remark,
          menuIds: createPackageDto.menuIds,
          createBy: createPackageDto.createBy,
          updateBy: createPackageDto.updateBy,
        },
      })
    } catch (e) {
      throw new HttpException('创建套餐失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 查询套餐列表
   * @param current 当前页
   * @param pageSize 每页大小
   */
  async getList(current = 1, pageSize = 10, sortField?: string, sortOrder?: string, packageName?: string) {
    const orderBy = {}
    if (sortField && sortOrder) {
      orderBy[sortField] = sortOrder
    } else {
      orderBy['createTime'] = 'desc'
    }

    const where = packageName
      ? {
          packageName: {
            contains: packageName, // 使用 contains 进行模糊匹配
          },
        }
      : {}
    try {
      const res = await this.prisma.sys_tenant_package.findMany({
        skip: (current - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
        where: where,
      })
      return {
        results: res,
        total: await this.prisma.sys_tenant_package.count({ where }),
        current: current,
        pageSize: pageSize,
      }
    } catch (e) {
      throw new HttpException('查询套餐列表失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 根据ID查询套餐
   * @param id
   */
  async getOne(id: number) {
    try {
      return await this.prisma.sys_tenant_package.findUnique({
        where: { id },
      })
    } catch (e) {
      throw new HttpException('查询套餐失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 更新套餐
   * @param updatePackageDto
   */
  async update(updatePackageDto: UpdatePackageDto) {
    const { id } = updatePackageDto
    try {
      return this.prisma.sys_tenant_package.update({
        where: { id },
        data: {
          packageName: updatePackageDto.packageName,
          remark: updatePackageDto.remark,
          menuIds: updatePackageDto.menuIds,
          updateBy: updatePackageDto.updateBy,
        },
      })
    } catch (e) {
      throw new HttpException('更新套餐失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 删除套餐
   * @param id
   */
  async delete(id: number) {
    try {
      return this.prisma.sys_tenant_package.delete({
        where: { id },
      })
    } catch (e) {
      throw new HttpException('删除套餐失败', HttpStatus.BAD_REQUEST)
    }
  }
}
