import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/log-in.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import type { AuthenticatedRequest } from './interfaces/authenticatedRequest.interface';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Body() signupDto: SignUpDto) {
    return this.authService.create(signupDto);
  }


  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthDto: UpdateUserDto,
    @Req() req: any
  ) {
    return this.authService.update(+id, updateAuthDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
