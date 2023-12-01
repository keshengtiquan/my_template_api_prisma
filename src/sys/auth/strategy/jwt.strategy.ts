import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../../../prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      //解析用户提交的bearer token header数据
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //加密的 secret
      secretOrKey: configService.get('jwt_secret'),
    })
  }

  async validate({ sub: id }) {
    const user = await this.prisma.sys_user.findUnique({
      where: {
        id: id,
      },
      include: {
        roles: true,
      },
    })
    delete user.password
    return user
  }
}
