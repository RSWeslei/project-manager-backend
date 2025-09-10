import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UserPayload } from '@/common/interfaces/user-payload.interface';

interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

@Injectable({ scope: Scope.REQUEST })
export class AuthUserService {
  constructor(@Inject(REQUEST) private request: AuthenticatedRequest) {}

  getUser(): UserPayload {
    return this.request.user;
  }

  getUserId(): number {
    return this.request.user?.sub;
  }

  getUserRole(): string {
    return this.request.user?.role;
  }
}