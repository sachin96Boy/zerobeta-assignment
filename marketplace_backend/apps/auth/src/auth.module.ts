import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: `${configService.get('JWT_EXPIRATION')}` },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    LoggerModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, AuthService],
})
export class AuthModule {}
