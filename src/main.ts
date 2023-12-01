import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './filter/http-exception.filter'
import { WINSTON_LOGGER_TOKEN } from './winston/winston.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useLogger(app.get(WINSTON_LOGGER_TOKEN))

  const configService = app.get(ConfigService)
  await app.listen(configService.get('nest_server_port'))
}
bootstrap().then((r) => r)
