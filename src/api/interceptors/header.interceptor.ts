import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotAcceptableException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../infrastructure/auth/auth.service';

@Injectable()
export class HeaderInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const header = context.switchToHttp().getRequest().headers;

    if (header['accept'] === 'application/xml') {
      throw new NotAcceptableException({
        status: HttpStatus.NOT_ACCEPTABLE,
        message: 'Header not Acceptable',
      });
    }

    const authorizationType = header['authorization']?.split(' ')[0];

    if (authorizationType === 'Basic') {
      const credentials = Buffer.from(
        header['authorization'].split(' ')[1],
        'base64',
      ).toString('ascii');

      const login = credentials.split(':')[0];
      const password = credentials.split(':')[1];
      this.authService.setLoginAndPassword(login, password);
    }

    return next.handle();
  }
}
