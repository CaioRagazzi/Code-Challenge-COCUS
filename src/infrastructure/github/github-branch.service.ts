import { HttpService, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { GithubBranchResponse } from '../models/github-branch-response';

@Injectable()
export class GithubBranchService {
  constructor(
    private httpService: HttpService,
    private authService: AuthService,
  ) {}
  async getBranches(
    userName: string,
    repositoryName: string,
  ): Promise<GithubBranchResponse[]> {
    const githubCommitResponse = await this.httpService
      .get<GithubBranchResponse[]>(
        `https://api.github.com/repos/${userName}/${repositoryName}/branches`,
        {
          headers: {
            accept: 'application/vnd.github.v3+json',
          },
          auth: {
            username: this.authService.getLogin(),
            password: this.authService.getPassword(),
          },
        },
      )
      .toPromise();

    return githubCommitResponse.data;
  }
}
