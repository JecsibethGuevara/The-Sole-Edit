import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/log-in.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'node_modules/bcryptjs';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) { }


  async create(SignUpDto: SignUpDto): Promise<{ user: Omit<User, 'password_hash'>; token: string }> {
    const { email, password, name } = SignUpDto;

    const existingUser = await this.userRepository.findOne({
      where: { email }
    })

    // remember:  implement filters and interceptors
    if (existingUser) {
      throw new BadRequestException('This email is already in used')
    }

    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds)

    const user = this.userRepository.create({
      email,
      password_hash,
      name,
    })

    await this.userRepository.save(user);

    const payload: JwtPayload = { userId: user.id, email: user.email }
    const token = this.jwtService.sign(payload)

    const { password_hash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: Omit<User, 'password_hash'>; token: string }> {
    const { email, password } = loginDto;

    //find user
    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      throw new BadRequestException('This User does not exist')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password')
    }

    const payload: JwtPayload = { userId: user.id, email: user.email }
    const token = this.jwtService.sign(payload)

    const { password_hash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: payload.userId } });
  }


  async update(id: number, updateAuthDto: UpdateUserDto, requestingUserId) {
    const { email, name, password } = updateAuthDto
    console.log(id, requestingUserId)

    if (id !== requestingUserId) {
      throw new UnauthorizedException('You have no authorization to change this user')
    }

    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    if (updateAuthDto.email && updateAuthDto.email !== user.email) {
      const isUsedEmail = await this.userRepository.findOne({ where: { email: updateAuthDto.email } })

      if (isUsedEmail) {
        throw new BadRequestException('Email is already in use')
      }
    }


    if (updateAuthDto.password) {
      const saltRounds = 12
      updateAuthDto.password = await bcrypt.hash(updateAuthDto.password, saltRounds)
    }

    await this.userRepository.update(id, {
      ...updateAuthDto,
      ...(updateAuthDto.password && { password_hash: updateAuthDto.password })
    })

    const updatedUser = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'updatedAt']
    })
    return updatedUser
  }


  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: { id }
    })
    if (!user) {
      throw new BadRequestException('User does not exist')
    }
    await this.userRepository.update(id, {
      is_active: false
    })
    const deletedUser = await this.userRepository.findOne({ where: { id }, select: ['id', 'name', 'email', 'updatedAt'] })
    return deletedUser;
  }
}
