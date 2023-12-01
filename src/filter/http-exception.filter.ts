import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, Injectable } from '@nestjs/common'
import { Request, Response } from 'express'
import { formatDate } from '../utils'
import { WINSTON_LOGGER_TOKEN } from '../winston/winston.module'

@Catch(HttpException)
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  @Inject(WINSTON_LOGGER_TOKEN)
  private logger

  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp()
    const response = http.getResponse<Response>()
    const request = http.getRequest<Request>()
    const statusCode = exception.getStatus()
    /**当前请求方式 */
    const method = request.method
    /**当前请求路径 */
    const url = request.url
    /**当前请求参数 */
    const body = request.body
    /**当前params参数 */
    const params = request.params
    /**当前query参数 */
    const query = request.query
    /**当前用户信息 */
    const user = request.user
    const message = {
      url,
      method,
      user,
      body,
      params,
      query,
    }

    const res = exception.getResponse() as { message: string[] }

    response.status(statusCode).json({
      code: statusCode,
      message: res?.message?.join ? res?.message?.join(',') : exception.message,
      path: request.url,
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    })
  }
}
