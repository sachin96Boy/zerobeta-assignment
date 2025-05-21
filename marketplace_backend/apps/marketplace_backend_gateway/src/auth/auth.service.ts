import { AUTH_SERVICE, CreateUserDto, LoginDto } from '@app/common';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientKafkaProxy,
  ) {}

  login(loginDto: LoginDto) {
    return this.authClient.send('login.user', { ...loginDto }).pipe(
      catchError((err) => {
        throw new UnprocessableEntityException(err);
      }),
    );
  }

  register(createUserDto: CreateUserDto) {
    return this.authClient.send('register.user', { ...createUserDto }).pipe(
      catchError((err) => {
        throw new UnprocessableEntityException(err);
      }),
    );
  }
}
