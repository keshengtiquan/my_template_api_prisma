import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { md5 } from '../../utils'

@Injectable()
export class AuthService {
  @Inject(PrismaService)
  private prisma: PrismaService
  @Inject(JwtService)
  private jwtService: JwtService

  async login(loginDto: LoginDto) {
    const user = await this.prisma.sys_user.findFirst({
      where: {
        userName: loginDto.userName,
      },
    })

    if (user.password !== md5(loginDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST)
    }
    return this.token(user)
  }

  private async token({ id, userName }) {
    return {
      token: await this.jwtService.signAsync(
        {
          sub: id,
          userName,
        },
        {
          expiresIn: '1d',
        },
      ),
    }
  }
}
