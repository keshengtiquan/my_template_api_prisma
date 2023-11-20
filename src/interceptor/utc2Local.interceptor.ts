import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable, tap } from 'rxjs'
import { formatDate } from '../utils'

@Injectable()
export class UtcToLocalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        if (data) {
          data.data = this.utc2local(data.data)
        }
      }),
      // map((data) => {
      //     if (data) {
      //       data = this.utc2local(data)
      //     }
      // }),
    )
  }

  private utc2local(data: any[]) {
    return data.map((item) => {
      const { createTime, updateTime, ...fields } = item
      const obj = {
        createTime: formatDate(createTime, 'YYYY-MM-DD HH:mm:ss'),
        updateTime: formatDate(updateTime, 'YYYY-MM-DD HH:mm:ss'),
        ...fields,
      }
      console.log(obj)
      if (item.children && item.children.length > 0) {
        obj.children = this.utc2local(item.children)
      }
      return obj
    })
  }
}
