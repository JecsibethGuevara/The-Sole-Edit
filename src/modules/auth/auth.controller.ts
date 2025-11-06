import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/log-in.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import type { AuthenticatedRequest } from './interfaces/authenticatedRequest.interface';
import { JwtService } from '@nestjs/jwt';
import { BlacklistService } from './blacklist.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private blacklistService: BlacklistService) { }

  @Post('signup')
  async signup(@Body() signupDto: SignUpDto) {
    return this.authService.create(signupDto);
  }


  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    const token = req.headers['authorization'].split(' ')[1];
    if (token) {
      this.blacklistService.addToBlacklist(token);
    }

    return {
      success: true,
      message: 'Logged out successfully',
      blacklisted_tokens: this.blacklistService.getBlacklistSize(),
    };
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
