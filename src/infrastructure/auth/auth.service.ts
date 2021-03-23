import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private login: string;
  private password: string;

  setLoginAndPassword(login: string, password: string): void {
    this.login = login;
    this.password = password;
  }

  getLogin(): string {
    return this.login;
  }

  getPassword(): string {
    return this.password;
  }
}
