import { DatabaseModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './models/user.entity';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([User]),
    AuthModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
