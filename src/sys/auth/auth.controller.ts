import { Controller, Get, Post, Body, HttpCode, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { Auth } from './decorators/auth.decorators'
import { Result } from '../../common/results'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto)
    return Result.success(data)
  }

  @Get('/userInfo')
  @HttpCode(200)
  @Auth()
  getUserInfo(@Req() req) {
    return Result.success(req.user)
  }
}
