import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { User } from '../common/interface'

@Injectable()
export class AddUserToDtoInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user // 获取当前登录用户信息
    const body = request.body
    body.tenantId = user.tenantId
    body.createBy = user.nickName
    body.updateBy = user.nickName
    body.createDept = user.createDept
    return next.handle()
  }
}
