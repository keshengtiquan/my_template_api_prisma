import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from './sys/user/user.module'
import { AuthModule } from './sys/auth/auth.module'
import { RoleModule } from './sys/role/role.module'
import { MenuModule } from './sys/menu/menu.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { UtcToLocalInterceptor } from './interceptor/utc2Local.interceptor'
import { ResponseInterceptor } from './interceptor/response.interceptor'

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '30m', // 默认 30 分钟
          },
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    RoleModule,
    MenuModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
