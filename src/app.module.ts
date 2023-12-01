import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from './sys/user/user.module'
import { AuthModule } from './sys/auth/auth.module'
import { RoleModule } from './sys/role/role.module'
import { MenuModule } from './sys/menu/menu.module'
import { PackageModule } from './sys/package/package.module'
import { WinstonModule } from './winston/winston.module'
import { format, transports } from 'winston'
import { TenantModule } from './sys/tenant/tenant.module'
import 'winston-daily-rotate-file'
import * as chalk from 'chalk'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggerInterceptor } from './interceptor/logger.interceptor'
import { DeptModule } from './sys/dept/dept.module';

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, time }) => {
              const appStr = chalk.green(`[NEST]`)
              const contextStr = chalk.yellow(`[${context}]`)

              return `${appStr} ${time} ${level} ${contextStr} ${message} `
            }),
          ),
        }),
        new transports.DailyRotateFile({
          level: 'info',
          dirname: 'log',
          filename: 'log-%DATE%.log',
          datePattern: 'YYYYMMDD',
          maxSize: '1024k',
        }),
      ],
    }),
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
    PackageModule,
    WinstonModule,
    TenantModule,
    DeptModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
