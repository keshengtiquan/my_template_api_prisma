import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateTenantDto } from './dto/create-tenant.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { md5 } from '../../utils'
import { FindTenantDto } from './dto/find-tenant.dto'
import { User } from '../../common/interface'
import { UpdateTenantDto } from './dto/update-tenant.dto'
import { ManagementGroup } from '../../enums'

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建租户
   * @param createTenantDto
   */
  async create(createTenantDto: CreateTenantDto) {
    try {
      return await this.prisma.$transaction(async () => {
        const tenant = await this.prisma.sys_tenant.create({
          data: {
            contactUserName: createTenantDto.contactUserName,
            contactPhone: createTenantDto.contactPhone,
            companyName: createTenantDto.companyName,
            address: createTenantDto.address,
            createBy: createTenantDto.createBy,
            updateBy: createTenantDto.updateBy,
            packageId: createTenantDto.packageId,
          },
        })
        if (!tenant.id) {
          throw new HttpException('创建租户过程失败', HttpStatus.BAD_REQUEST)
        }
        await this.prisma.sys_user.create({
          data: {
            userName: createTenantDto.userName,
            password: md5(createTenantDto.password),
            nickName: '项目管理员',
            tenantId: tenant.id,
            userType: 'sys_user',
          },
        })
        return tenant
      })
    } catch (e) {
      throw new HttpException('创建租户失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 查询租户列表
   * @param findTenantDto
   */
  async findList(findTenantDto: FindTenantDto, user: User) {
    const { current = 1, pageSize = 10 } = findTenantDto
    const orderBy = {}
    if (findTenantDto.sortField && findTenantDto.sortOrder) {
      orderBy[findTenantDto.sortField] = findTenantDto.sortOrder
    } else {
      orderBy['createTime'] = 'desc'
    }
    const where: any = {}
    if (findTenantDto.status) {
      where.status = findTenantDto.status
    }
    if (findTenantDto.companyName) {
      where.companyName = {
        contains: findTenantDto.companyName,
      }
    }
    if (findTenantDto.contactUserName) {
      where.contactUserName = {
        contains: findTenantDto.contactUserName,
      }
    }
    try {
      if (user.tenantId != ManagementGroup.ID) {
        throw new HttpException('无权访问', HttpStatus.FORBIDDEN)
      }
      const res = await this.prisma.sys_tenant.findMany({
        skip: (current - 1) * pageSize,
        take: +pageSize,
        where,
        orderBy,
      })
      return {
        results: res,
        total: await this.prisma.sys_tenant.count({ where }),
        current: current,
        pageSize: pageSize,
      }
    } catch (e) {
      throw new HttpException('查询租户列表失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 禁用租户
   * @param id 租户id
   * @param status 1启用 0 禁用
   */
  async forbidden(id: number, status: string) {
    if (id === 1) {
      throw new HttpException('无法禁用超级管理员租户', HttpStatus.BAD_REQUEST)
    }
    try {
      return await this.prisma.sys_tenant.update({
        where: {
          id,
        },
        data: {
          status: status,
        },
      })
    } catch (e) {
      throw new HttpException('禁用租户失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 查询租户
   * @param id 租户ID
   */
  async getOne(id: number) {
    try {
      return await this.prisma.sys_tenant.findUnique({
        where: { id },
      })
    } catch (e) {
      throw new HttpException('查询租户失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 更新租户
   * @param updateTenantDto
   */
  async updateTenant(updateTenantDto: UpdateTenantDto) {
    try {
      return await this.prisma.sys_tenant.update({
        where: {
          id: updateTenantDto.id,
        },
        data: {
          contactUserName: updateTenantDto.contactUserName,
          contactPhone: updateTenantDto.contactPhone,
          companyName: updateTenantDto.companyName,
          address: updateTenantDto.address,
          packageId: updateTenantDto.packageId,
          updateBy: updateTenantDto.updateBy,
        },
      })
    } catch (e) {
      throw new HttpException('更新租户失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 删除租户
   * @param id
   */
  async deleteTenant(id: number) {
    try {
      return this.prisma.$transaction([
        this.prisma.sys_tenant.delete({
          where: { id },
        }),
        this.prisma.sys_user.deleteMany({
          where: { tenantId: id },
        }),
      ])
    } catch (e) {
      throw new HttpException('删除租户失败', HttpStatus.BAD_REQUEST)
    }
  }
}
