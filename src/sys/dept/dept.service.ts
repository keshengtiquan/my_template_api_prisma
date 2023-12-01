import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { CreateDeptDto } from './dto/create-dept.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { WINSTON_LOGGER_TOKEN } from '../../winston/winston.module'
import { User } from '../../common/interface'
import { handleTree } from '../../utils'
import { ManagementGroup } from '../../enums'
import { UpdateDeptDto } from './dto/update-dept.dto'

@Injectable()
export class DeptService {
  constructor(private prisma: PrismaService) {}

  @Inject(WINSTON_LOGGER_TOKEN)
  private logger

  /**
   * 创建部门
   * @param createDeptDto
   */
  async create(createDeptDto: CreateDeptDto) {
    try {
      return await this.prisma.sys_dept.create({
        data: {
          tenantId: createDeptDto.tenantId,
          parentId: createDeptDto.parentId,
          deptName: createDeptDto.deptName,
          leader: createDeptDto.leader,
          phone: createDeptDto.phone,
          email: createDeptDto.email,
          createBy: createDeptDto.createBy,
          updateBy: createDeptDto.updateBy,
        },
      })
    } catch (e) {
      console.log(e)
      throw new HttpException('创建角色失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 查询部门列表
   * @param current
   * @param pageSize
   * @param sortField
   * @param sortOrder
   */
  async getlist(current: number, pageSize: number, sortField: string, sortOrder: string, user: User) {
    const orderBy = {}
    if (sortField && sortOrder) {
      orderBy[sortField] = sortOrder
    } else {
      orderBy['createTime'] = 'desc'
    }
    const where: any = {}
    if (user.tenantId != ManagementGroup.ID) {
      where.tenantId = user.tenantId
    }
    try {
      const res = await this.prisma.sys_dept.findMany({
        skip: (current - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
        where: where,
      })
      return handleTree(res)
    } catch (e) {
      throw new HttpException('查询部门列表失败', HttpStatus.BAD_REQUEST)
    }
  }
  /**
   * 禁用部门
   * @param id 角色id
   * @param status 1启用 0 禁用
   */
  async forbidden(id: number, status: string) {
    try {
      return await this.prisma.sys_dept.update({
        where: { id },
        data: {
          status: status,
        },
      })
    } catch (e) {
      throw new HttpException('禁用失败', HttpStatus.BAD_REQUEST)
    }
  }
  /**
   * 根据ID查询部门
   * @param id
   */
  async getOneById(id: number) {
    try {
      return await this.prisma.sys_dept.findUnique({
        where: { id },
      })
    } catch (e) {
      throw new HttpException('查询部门失败', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 更新部门
   * @param updateDeptDto
   */
  async update(updateDeptDto: UpdateDeptDto) {
    try {
      return await this.prisma.sys_dept.update({
        where: { id: updateDeptDto.id },
        data: {
          parentId: updateDeptDto.parentId,
          deptName: updateDeptDto.deptName,
          leader: updateDeptDto.leader,
          phone: updateDeptDto.phone,
          email: updateDeptDto.email,
          updateBy: updateDeptDto.updateBy,
        },
      })
    } catch (e) {
      throw new HttpException('更新部门失败', HttpStatus.BAD_REQUEST)
    }
  }
  /**
   * 删除部门
   * @param id
   */
  async delete(id: number) {
    try {
      return await this.prisma.$transaction([
        this.prisma.sys_dept.delete({ where: { id } }),
        this.prisma.sys_user.updateMany({
          where: { deptId: id },
          data: {
            deptId: null,
          },
        }),
      ])
    } catch (e) {
      throw new HttpException('删除部门失败', HttpStatus.BAD_REQUEST)
    }
  }
}
