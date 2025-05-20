import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

import * as bcrypt from 'bcryptjs';
import { User } from './models/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const plainPassword = createUserDto.password;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existingUser = await this.usersRepository.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new UnprocessableEntityException('User already exists');
    }

    const user = new User({
      ...createUserDto,
      password: hashedPassword,
    });

    const createdUser = await this.usersRepository.create(user);
    const userWithoutPasswod = {
      ...createdUser,
      password: undefined,
    };
    return userWithoutPasswod;
  }

  async validate(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      email,
    });
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async getUser(paylod: { email: string; sub: string }) {
    const user = await this.usersRepository.findOne({
      id: paylod.sub,
      email: paylod.email,
    });
    if (!user) {
      return null;
    }
    const userWithoutPassword = {
      ...user,
      password: undefined,
    };
    return userWithoutPassword;
  }
}
